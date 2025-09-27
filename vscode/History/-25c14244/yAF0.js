"use server";

import PaymentHistoryModel from "@/models/payment.model";
import dbConnect from "../db-connect";
import { requireAdmin } from "../auth/require-admin";
import { objectId } from "../utils";
import { revalidatePath } from "next/cache";

// ✅ Create Payment
export async function createPayment({ data, path }) {
  try {
    await dbConnect();
    await requireAdmin();

    const newPayment = new PaymentHistoryModel({ ...data });
    await newPayment.save();

    if (path) revalidatePath(path);
    return JSON.parse(JSON.stringify(newPayment));
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

// ✅ Get All Payments
export const getPayments = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const response = await fetch(`/api/payments?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading payments:", error);
    throw error;
  }
};


export async function getPaymentById(id) {
  try {
    await dbConnect();
    await requireAdmin();

    const payment = await PaymentHistoryModel.findOne({ _id: objectId(id) }).lean();
    return payment ? JSON.parse(JSON.stringify(payment)) : null;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw error;
  }
}

export async function updatePayment({ paymentId, data, path }) {
  try {
    await dbConnect();
    await requireAdmin();

    const updatedPayment = await PaymentHistoryModel.findOneAndUpdate(
      { _id: objectId(paymentId) },
      { $set: data },
      { new: true }
    );

    if (path) revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedPayment));
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
}

export async function deletePayment({ paymentId, path }) {
  try {
    await dbConnect();
    await requireAdmin();

    const result = await PaymentHistoryModel.findOneAndDelete({
      _id: objectId(paymentId),
    });

    if (!result) throw new Error("Payment not found");

    if (path) revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
}
