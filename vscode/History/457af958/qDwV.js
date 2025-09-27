"use server";

import BrtaServiceModel from "@/models/brta-service.model";
import ProjectModel from "@/models/project.model";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { requireAdmin } from "../auth/require-admin";
import dbConnect from "../db-connect";
import { objectId } from "../utils";

// Get all project for public
export const getService = async ({
  search,
  page = 1,
  limit = 6,
  isFeatured = false,
}) => {
  try {
    await dbConnect();

    const query = {
      isPublished: true,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      }),
    };

    if (isFeatured) {
      query.isFeatured = true;
    }

    const sortOrder = {
      featured: -1,
      order: -1,
      createdAt: -1,
    };

    const [projects, total] = await Promise.all([
      ProjectModel.find(query)
        .select(
          "_id title coverImage shortDescription categories slug createdAt",
        )
        .sort(sortOrder)
        .limit(limit * page)
        .lean(),
      ProjectModel.countDocuments(query),
    ]);

    const hasNextPage = total > page * limit;

    return {
      projects: JSON.parse(JSON.stringify(projects)),
      total,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

// Function to fetch a single project by slug
export const getProjectBySlug = unstable_cache(
  async (slug, isAdmin = false) => {
    try {
      await dbConnect();

      const query = { slug };

      if (!isAdmin) {
        Object.assign(query, { isPublished: true });
      }

      const project = await ProjectModel.findOne(query);
      return project ? JSON.parse(JSON.stringify(project)) : null;
    } catch (error) {
      console.error("Error fetching project by slug:", error);
      throw new Error("Error fetching project by slug");
    }
  },
  ["getProjectBySlug"],
  { tags: ["project-by-slug"] },
);

// Get all project for admin
export const getServiceForAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
}) => {
  try {
    await dbConnect();

    await requireAdmin();

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: "i" } }],
      }),
    };

    const [project, total] = await Promise.all([
      ProjectModel.find(query)
        .select("_id title isPublished isFeatured order updatedAt slug")
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
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
};

// create a new project
export async function createBrtaService({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the Project
    const newProject = new BrtaServiceModel({ ...data });
    await newProject.save();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// update a existing Project
export async function updateProject({ projectId, data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId },
      data,
      { new: true },
    );

    revalidatePath(path);
    revalidateTag("Projects");
    revalidateTag("Project-by-slug");
    revalidateTag("admin-Projects");
    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    console.error("Error updating project:", error);
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
