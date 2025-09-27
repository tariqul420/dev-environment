"use server"

import PaymentModel from "@/models/payment.model";
import { requireAdmin } from "../auth/require-admin";
import dbConnect from "../db-connect";

// create a new project
export async function createPayment({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the Project
    const newProject = new PaymentModel({ ...data });
    await newProject.save();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}