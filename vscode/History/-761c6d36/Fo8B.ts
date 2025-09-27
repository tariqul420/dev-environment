'use server';

import { default as Project, default as ProjectModel } from '@/models/project.model';
import { ParamsPropsType } from '@/types';
import { IProject } from '@/types/project';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '../auth/require-admin';
import dbConnect from '../db-connect';
import { objectId } from '../utils';

// Get all project for public
export const getProjects = async ({ search, sort = 'default', page = 1, limit = 6 }: ParamsPropsType) => {
  try {
    await dbConnect();

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }],
      }),
    };

    const sortOrder: { [key: string]: 1 | -1 } = {
      createdAt: sort === 'date' ? -1 : -1,
    };

    const [projects, total] = await Promise.all([
      ProjectModel.find(query)
        .select('_id title description categories slug createdAt')
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
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

// Function to fetch a single project by slug
export async function getProjectBySlug(slug: string) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug });
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw error;
  }
}

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
        .select('_id title 	isFeatured categories createdAt updatedAt slug')
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
    console.error('Error fetching project:', error);
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
    revalidateTag('projects');
    revalidateTag('Project-by-slug');
    revalidateTag('admin-projects');
    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    console.error('Error creating project:', error);
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
    revalidateTag('Projects');
    revalidateTag('Project-by-slug');
    revalidateTag('admin-Projects');
    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    console.error('Error updating project:', error);
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
    revalidateTag('projects');
    revalidateTag('project-by-slug');
    revalidateTag('admin-projects');

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
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
    console.error('Error deleting projects:', error);
    throw new Error('Failed to delete projects');
  }
}
