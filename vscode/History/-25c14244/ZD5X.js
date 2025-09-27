"use server"

import PaymentModel from "@/models/payment.model";
import { requireAdmin } from "../auth/require-admin";
import dbConnect from "../db-connect";

// create a new payment
export async function createPayment({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the payment
    const newProject = new PaymentModel({ ...data });
    await newProject.save();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error("Error creating payment:", error);
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
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}

// Delete multiple projects
export async function deleteProjects(ids) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await ProjectModel.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error("No projects were deleted");
    }

    revalidatePath("/admin/projects");
    revalidateTag("projects");
    revalidateTag("project-by-slug");
    revalidateTag("admin-projects");
  } catch (error) {
    console.error("Error deleting projects:", error);
    throw new Error("Failed to delete projects");
  }
}
