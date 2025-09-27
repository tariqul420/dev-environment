'use server';

import ProjectModel from '@/models/project.model';
import { ParamsPropsType } from '@/types';
import { IProject } from '@/types/project';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '../auth/require-admin';
import dbConnect from '../db-connect';
import logger from '../logger';
import { objectId } from '../utils';

// Get all project for public
export const getProjects = async ({ search, page = 1, limit = 6, isFeatured = false }: ParamsPropsType & { isFeatured?: boolean }) => {
  try {
    await dbConnect();

    const query = {
      isPublished: true,
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }],
      }),
    } as Record<string, unknown>;

    if (isFeatured) {
      query.isFeatured = true;
    }

    const sortOrder: { [key: string]: 1 | -1 } = {
      featured: -1,
      order: -1,
      createdAt: -1,
    };

    const [projects, total] = await Promise.all([
      ProjectModel.find(query)
        .select('_id title coverImage shortDescription categories slug createdAt')
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
    logger.error({ error }, 'Error fetching projects');
    throw new Error('Failed to fetch projects');
  }
};

// Function to fetch a single project by slug
export const getProjectBySlug = async (slug: string, isAdmin: boolean = false) => {
  try {
    await dbConnect();

    const query = { slug };

    if (!isAdmin) {
      Object.assign(query, { isPublished: true });
    }

    const project = await ProjectModel.findOne(query);
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    logger.error({ error }, 'Error fetching project by slug');
    throw new Error('Error fetching project by slug');
  }
};

// Get all project for admin
export const getProjectsForAdmin = async ({ page = 1, limit = 20, search = '' }: { page?: number; limit?: number; search?: string }) => {
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

// create a new project
export async function createProject({ data, path }: { data: IProject; path: string }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    // Add the userId as the instructor for the Project
    const newProject = new ProjectModel({ ...data });
    await newProject.save();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    logger.error({ error }, 'Error creating project');
    throw error;
  }
}

// update a existing Project
export async function updateProject({ projectId, data, path }: { projectId: string; data: IProject; path: string }) {
  try {
    await dbConnect();

    // Authentication and authorization
    await requireAdmin();

    const updatedProject = await ProjectModel.findOneAndUpdate({ _id: projectId }, data, { new: true });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    logger.error({ error }, 'Error updating project');
    throw error;
  }
}

// Delete a project
export async function deleteProject({ projectId, path }: { projectId: string; path: string }) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await ProjectModel.findOneAndDelete({
      _id: objectId(projectId),
    });

    if (!result) {
      throw new Error('project not found');
    }

    revalidatePath(path);

    return { success: true };
  } catch (error) {
    logger.error({ error }, 'Error deleting project');
    throw new Error('Failed to delete project');
  }
}

// Delete multiple projects
export async function deleteProjects(ids: string[]) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await ProjectModel.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error('No projects were deleted');
    }

    revalidatePath('/admin/projects');
    revalidateTag('projects');
    revalidateTag('project-by-slug');
    revalidateTag('admin-projects');
  } catch (error) {
    logger.error({ error }, 'Error deleting projects');
    throw new Error('Failed to delete projects');
  }
}
