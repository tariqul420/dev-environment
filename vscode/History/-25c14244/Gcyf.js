"use server"

// create a new project
export async function createPayment({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the Project
    const newProject = new ProjectModel({ ...data });
    await newProject.save();

    revalidatePath(path);
    revalidateTag("projects");
    revalidateTag("project-by-slug");
    revalidateTag("admin-projects");
    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}