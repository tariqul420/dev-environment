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
export async function deleteProject({ projectId, path }) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await ProjectModel.findOneAndDelete({
      _id: objectId(projectId),
    });

    if (!result) {
      throw new Error("project not found");
    }

    revalidatePath(path);
    revalidateTag("projects");
    revalidateTag("project-by-slug");
    revalidateTag("admin-projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}