import mongoose from "mongoose";

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

/** Helper Validators */
const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Schema */
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

// Always keep netAmount in sync
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

/** Indexes */
PaymentSchema.index({ name: "text", reference: "text", tags: "text" });

// Export model
const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default PaymentModel;
