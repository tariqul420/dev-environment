import mongoose from "mongoose";
import BrtaServiceModel from "./brta-service.js";

/** -------------------- Constants -------------------- */
const PAYMENT_METHODS = [
  "bkash",
  "nagad",
  "rocket",
  "upay",
  "bank_transfer",
  "card",
  "paypal",
  "stripe",
  "cod",
  "other",
];

const CURRENCIES = ["BDT", "USD", "EUR", "INR", "GBP"];
const STATUSES = ["pending", "success", "failed", "refunded", "disputed"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** -------------------- Helpers -------------------- */
function normalizePhone(p) {
  if (!p) return "";
  return String(p).replace(/\D/g, ""); // keep digits only
}

function safeNumber(n, def = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : def;
}

function getNet(doc) {
  if (!doc) return 0;
  const net =
    typeof doc.netAmount === "number" && !Number.isNaN(doc.netAmount)
      ? doc.netAmount
      : safeNumber(doc.amount, 0);
  return Number(safeNumber(net).toFixed(2));
}

/** BrtaService.payAmount increment/decrement by phone (normalized) */
async function incBrtaPayAmountByPhoneRaw(payerPhoneRaw, delta) {
  const norm = normalizePhone(payerPhoneRaw);
  const d = safeNumber(delta, 0);
  if (!norm || !d) return;

  // Pull small projection to reduce IO
  const candidates = await BrtaServiceModel.find(
    { phone: { $exists: true, $ne: null, $ne: "" } },
    { _id: 1, phone: 1 }
  ).lean();

  const hit = candidates.find((c) => normalizePhone(c.phone) === norm);
  if (!hit) return;

  // Ensure we never go negative accidentally; let business rules decide if negative allowed
  await BrtaServiceModel.findByIdAndUpdate(
    hit._id,
    { $inc: { payAmount: d } },
    { new: true }
  );
}

/** prev -> curr delta apply */
async function applyDelta(prev, curr) {
  const oldPhone = normalizePhone(prev?.payerPhone);
  const newPhone = normalizePhone(curr?.payerPhone);

  const oldNet = getNet(prev);
  const newNet = getNet(curr);

  // Same phone: inc by (newNet - oldNet)
  if (oldPhone && newPhone && oldPhone === newPhone) {
    const delta = Number((newNet - oldNet).toFixed(2));
    if (delta !== 0) {
      await incBrtaPayAmountByPhoneRaw(newPhone, delta);
    }
    return;
  }

  // Phone changed (or one side missing)
  if (oldPhone && oldNet) {
    await incBrtaPayAmountByPhoneRaw(oldPhone, -Math.abs(oldNet));
  }
  if (newPhone && newNet) {
    await incBrtaPayAmountByPhoneRaw(newPhone, Math.abs(newNet));
  }
}

/** On delete: decrement corresponding BrtaService by payment net */
async function applyDelete(curr) {
  const phone = normalizePhone(curr?.payerPhone);
  const net = getNet(curr);
  if (phone && net) {
    await incBrtaPayAmountByPhoneRaw(phone, -Math.abs(net));
  }
}

/** -------------------- Schema -------------------- */
const PaymentSchema = new mongoose.Schema(
  {
    // Who paid
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    // How they paid
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
      index: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    // Money
    amount: {
      type: Number,
      required: true,
      min: 0.01,
      get: (v) => (typeof v === "number" ? Number(v.toFixed(2)) : v),
      set: (v) => Number(v),
    },

    currency: {
      type: String,
      enum: CURRENCIES,
      default: "BDT",
      index: true,
    },

    fees: {
      type: Number,
      default: 0,
      min: 0,
      get: (v) => (typeof v === "number" ? Number(v.toFixed(2)) : v),
      set: (v) => Number(v),
    },

    netAmount: {
      type: Number,
      min: 0,
      get: (v) => (typeof v === "number" ? Number(v.toFixed(2)) : v),
      set: (v) => Number(v),
    },

    // References / identifiers
    transactionId: {
      type: String,
      trim: true,
      index: { unique: true, sparse: true },
    },

    reference: {
      type: String,
      trim: true,
    },

    orderId: {
      type: String,
      trim: true,
      index: true,
    },

    // When it was paid
    paidAt: {
      type: Date,
      required: true,
      index: true,
    },

    // State
    status: {
      type: String,
      enum: STATUSES,
      default: "pending",
      index: true,
    },

    // Payer contacts (optional)
    payerPhone: {
      type: String,
      trim: true,
      required: true,
    },

    payerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || emailRegex.test(v),
        message: "Invalid email",
      },
    },

    // Tags / notes
    tags: {
      type: [String],
      default: [],
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // Refund info
    isRefund: {
      type: Boolean,
      default: false,
      index: true,
    },

    refundReason: {
      type: String,
      trim: true,
    },

    // Proof/receipts (image URLs)
    receipts: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true, getters: true },
  }
);

/** -------------------- Built-in syncs -------------------- */
// Keep netAmount & refund flag in sync
PaymentSchema.pre("validate", function (next) {
  if (typeof this.amount === "number") {
    const fees = typeof this.fees === "number" ? this.fees : 0;
    this.netAmount = Number((this.amount - fees).toFixed(2));
  }
  if (this.status === "refunded" && this.isRefund !== true) {
    this.isRefund = true;
  }
  next();
});

/** -------------------- Middlewares (Brta sync) -------------------- */
// save flow
PaymentSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // hold previous for delta
      // eslint-disable-next-line no-underscore-dangle
      this.$locals._prev = await this.constructor.findById(this._id).lean();
    }
    next();
  } catch (e) {
    next(e);
  }
});

PaymentSchema.post("save", async function (doc) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const prev = this.$locals?._prev;
    await applyDelta(prev, doc.toObject?.() ?? doc);
  } catch (e) {
    console.error("post(save) payAmount sync failed:", e);
  }
});

// findOneAndUpdate flow
PaymentSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // eslint-disable-next-line no-underscore-dangle
    this._prev = await this.model.findOne(this.getQuery()).lean();
    next();
  } catch (e) {
    next(e);
  }
});

PaymentSchema.post("findOneAndUpdate", async function (doc) {
  try {
    if (!doc) return;
    // eslint-disable-next-line no-underscore-dangle
    const prev = this._prev;
    await applyDelta(prev, doc.toObject?.() ?? doc);
  } catch (e) {
    console.error("post(findOneAndUpdate) payAmount sync failed:", e);
  }
});

// delete flows
// 1) findOneAndDelete / findByIdAndDelete
PaymentSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await applyDelete(doc.toObject?.() ?? doc);
  } catch (e) {
    console.error("post(findOneAndDelete) payAmount sync failed:", e);
  }
});

// 2) document.deleteOne()
PaymentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    // hold current for post hook
    // eslint-disable-next-line no-underscore-dangle
    this.$locals._curr = this.toObject?.() ?? this;
    next();
  } catch (e) {
    next(e);
  }
});

PaymentSchema.post("deleteOne", { document: true, query: false }, async function () {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const curr = this.$locals?._curr;
    if (curr) await applyDelete(curr);
  } catch (e) {
    console.error("post(deleteOne:doc) payAmount sync failed:", e);
  }
});

/** -------------------- Indexes -------------------- */
PaymentSchema.index({ name: "text", reference: "text", tags: "text" });

/** -------------------- Export -------------------- */
const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default PaymentModel;
