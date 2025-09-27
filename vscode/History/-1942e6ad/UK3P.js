import mongoose, { Schema } from "mongoose";

const BrtaServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    referenceHolder: { type: String },
    phone: { type: String, required: true },
    email: { type: String },

    dlReferenceNumber: { type: String },
    dlDateOfBirth: { type: Date },
    nidDateOfBirth: { type: Date },

    typesOfWork: {
      type: [String],
      required: true,
    },

    workingCondition: {
      type: String,
      enum: ["Normal Process", "Emerjency Process"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    agreementOfAmount: {
      type: Number,
      required: true,
      min: [0, "Agreement Amount cannot be negative"],
    },

    payAmount: {
      type: Number,
      required: function () {
        return this.paymentStatus === "paid";
      },
      min: [0, "Pay Amount cannot be negative"],
    },

    remarks: { type: String },

    // Files
    nid: { type: String },
    certificate: { type: String },
    drivingLicence: { type: String },
    utilityBill: { type: String },
    medicalReport: { type: String },
    doopTestReport: { type: String },
    visa: { type: String },
    passport: { type: String },
    ticket: { type: String },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "on-hold",
        "failed",
        "refunded",
        "unpaid",
        "paid",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

const BrtaServiceModel =
  mongoose.models.BrtaService ||
  mongoose.model("BrtaService", BrtaServiceSchema);

export default BrtaServiceModel;
