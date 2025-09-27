import mongoose from "mongoose";

const { Schema } = mongoose;

/** Reusable Enums */
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

/** ----------------------------- Helper Validators ------------------------ */
const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts BD numbers like +8801XXXXXXXXX or 01XXXXXXXXX; still permissive
const bdPhoneRegex =
  /^(?:\+?88)?01[3-9]\d{8}$/;

/** --------------------------------- Schema -------------------------------- */
const PaymentSchema = new Schema(
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
      // will be auto-set from amount - fees in pre-validate
    },

    // References / identifiers
    transactionId: {
      type: String,
      trim: true,
      index: { unique: true, sparse: true }, // make unique if provided
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
      validate: {
        validator: (v) => !v || bdPhoneRegex.test(v),
        message: "Invalid Bangladesh phone number format",
      },
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
    timestamps: true, // createdAt, updatedAt
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

/** ------------------------------ Derived Values -------------------------- */
// Always keep netAmount in sync
PaymentSchema.pre("validate", function (next) {
  if (typeof this.amount === "number") {
    const fees = typeof this.fees === "number" ? this.fees : 0;
    this.netAmount = Number((this.amount - fees).toFixed(2));
  }
  // If status is refunded, ensure isRefund flag is true (but allow manual override)
  if (this.status === "refunded" && this.isRefund !== true) {
    this.isRefund = true;
  }
  next();
});

/** -------------------------------- Indexes ------------------------------- */
// Text search for quick filtering by name/reference/tags
PaymentSchema.index({ name: "text", reference: "text", tags: "text" });

/** --------------------------- Export (Next.js safe) ----------------------- */
module.exports =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
