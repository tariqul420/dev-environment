"use server";

import BrtaServiceModel from "@/models/brta-service.model";
import { revalidatePath, unstable_cache } from "next/cache";
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
      BrtaServiceModel.find(query)
        .select(
          "_id title coverImage shortDescription categories slug createdAt",
        )
        .sort(sortOrder)
        .limit(limit * page)
        .lean(),
      BrtaServiceModel.countDocuments(query),
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
export const getServiceById = unstable_cache(
  async (id) => {
    try {
      await dbConnect();

      const project = await BrtaServiceModel.findOne({ _id: objectId(id) });
      return project ? JSON.parse(JSON.stringify(project)) : null;
    } catch (error) {
      console.error("Error fetching project by slug:", error);
      throw new Error("Error fetching project by slug");
    }
  },
  ["getServiceBySlug"],
  { tags: ["service-by-slug"] },
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
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const [service, total] = await Promise.all([
      BrtaServiceModel.find(query)
        .select("_id name phone email updatedAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      BrtaServiceModel.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      service: JSON.parse(JSON.stringify(service)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    throw new Error("Failed to fetch service");
  }
};

// create a new project
export async function createBrtaService({ data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the Project
    const newService = new BrtaServiceModel({ ...data });
    await newService.save();

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newService));
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// update a existing Project
export async function updateBrtaService({ serviceId, data, path }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    const updatedService = await BrtaServiceModel.findOneAndUpdate(
      { _id: serviceId },
      data,
      { new: true },
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedService));
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// Delete a project
export async function deleteService({ serviceId, path }) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await BrtaServiceModel.findOneAndDelete({
      _id: objectId(serviceId),
    });

    if (!result) {
      throw new Error("project not found");
    }

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}

// Delete multiple projects
export async function deleteServices(ids) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await BrtaServiceModel.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error("No services were deleted");
    }

    revalidatePath("/admin/brta-services");
  } catch (error) {
    console.error("Error deleting services:", error);
    throw new Error("Failed to delete services");
  }
}

// update service status
export async function updateServiceStatus(serviceId, status, path) {
  try {
    await dbConnect();

    await requireAdmin;

    const updatedService = await Order.findByIdAndUpdate(
      serviceId,
      { status },
      { new: true },
    ).lean();

    if (!updatedService) {
      throw new Error("Order not found");
    }

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedService));
  } catch (error) {
    logger.error("Error updating service status:", error);
    throw error;
  }
}
