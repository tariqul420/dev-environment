"use server"

import PaymentModel from "@/models/payment.model";
import { requireAdmin } from "../auth/require-admin";
import dbConnect from "../db-connect";
import { objectId } from "../utils";
import { revalidatePath, unstable_cache } from "next/cache";

export const getPaymentById = async (id) => {
    try {
      await dbConnect();
      const payment = await PaymentModel.findOne({ _id: objectId(id) });
      return payment ? JSON.parse(JSON.stringify(payment)) : null;
    } catch (error) {
      console.error("Error fetching service by id:", error);
      throw new Error("Error fetching service by id");
    }
  }
 


// Get all payment for admin
export const getPaymentsForAdmin = async ({ page = 1, limit = 20, search = '' }) => {
  try {
    await dbConnect();

    await requireAdmin();

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }],
      }),
    };

    const [payment, total] = await Promise.all([
      PaymentModel.find(query)
        .select('_id name paymentMethod transactionId amount fees netAmount status paidAt orderId')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      PaymentModel.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      payments: JSON.parse(JSON.stringify(payment)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Error fetching payment');
    throw new Error('Failed to fetch payment');
  }
};

// create a new payment
export async function createPayment({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the payment
    const newPayment = new PaymentModel({ ...data });
    await newPayment.save();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newPayment));
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

// update a existing payment
export async function updatePayment({ paymentId, data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { _id: paymentId },
      data,
      { new: true },
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedPayment));
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
}

// Delete a project
export async function deletePayment({ paymentId, path }) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await PaymentModel.findOneAndDelete({
      _id: objectId(paymentId),
    });

    if (!result) {
      throw new Error("Payment not found");
    }

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw new Error("Failed to delete payment");
  }
}

// Delete multiple projects
export async function deletePayments(ids) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await PaymentModel.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error("No payment were deleted");
    }

    revalidatePath("/admin/payment-history");
  } catch (error) {
    console.error("Error deleting projects:", error);
    throw new Error("Failed to delete projects");
  }
}
