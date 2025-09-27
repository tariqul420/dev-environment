"use server"

import PaymentModel from "@/models/payment.model";
import { requireAdmin } from "../auth/require-admin";
import dbConnect from "../db-connect";
import { objectId } from "../utils";
import { revalidatePath } from "next/cache";

// Get all project for admin
export const getProjectsForAdmin = async ({ page = 1, limit = 20, search = '' }) => {
  try {
    await dbConnect();

    await requireAdmin();

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }],
      }),
    };

    const [project, total] = await Promise.all([
      ProjectModel.find(query)
        .select('_id title isPublished isFeatured order updatedAt slug')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      ProjectModel.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      projects: JSON.parse(JSON.stringify(project)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error({ error }, 'Error fetching project');
    throw new Error('Failed to fetch project');
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
