import mongoose, { Document, Schema } from "mongoose";

export interface IBrtaService extends Document {
  name: string;
  referenceHolder?: string;
  phone: string;
  email?: string;
  dlReferenceNumber?: string;
  dlDateOfBirth?: Date;
  nidDateOfBirth?: Date;
  typesOfWork: string;
  workingCondition: "Normal Process" | "Emerjency Process";
  agreementOfAmount?: number;
  nid?: string;
  certificate?: string;
  drivingLicence?: string;
  utilityBill?: string;
  medicalReport?: string;
  doopTestReport?: string;
  visa?: string;
  passport?: string;
  ticket?: string;
  paymentStatus: "paid" | "unpaid";
}

const BrtaServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    referenceHolder: { type: String },
    phone: { type: String, required: true },
    email: { type: String },

    dlReferenceNumber: { type: String },
    dlDateOfBirth: { type: Date },
    nidDateOfBirth: { type: Date },

    typesOfWork: {
      type: String,
      enum: [
        "Learner",
        "Correction",
        "Vehicle Addition",
        "Nobayon",
        "Exam Date Change",
        "Delete Licence",
        "Help For Exam Passed",
        "Emerjency Smart Card",
        "New Date For Exam",
        "Other",
      ],
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
  },
  { timestamps: true }
);

export default mongoose.models.BrtaService ||
  mongoose.model<IBrtaService>("BrtaService", BrtaServiceSchema);
