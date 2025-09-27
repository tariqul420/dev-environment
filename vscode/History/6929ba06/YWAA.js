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
      required: function () {
        return this.paymentStatus === "paid";
      },
    },

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
        "pending", // Requested, waiting for confirmation
        "confirmed", // Accepted / booked
        "processing", // In progress
        "shipped", // Sent out / dispatched
        "delivered", // Completed & received
        "cancelled", // Cancelled before completion
        "on-hold", // Temporarily paused
        "failed", // Failed to complete
        "refunded", // Payment refunded
        "unpaid", // Payment pending
        "paid", // Payment completed
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

const BrtaServiceModel =
  mongoose.models.BrtaService ||
  mongoose.model("BrtaService", BrtaServiceSchema);

export default BrtaServiceModel;
