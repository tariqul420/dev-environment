'use server';

import { default as Blog, default as BlogModel } from '@/models/blog.model';
import { ParamsPropsType } from '@/types';
import { IBlog } from '@/types/blog';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '../auth/require-admin';
import dbConnect from '../db-connect';
import { objectId } from '../utils';

// Get all blogs for public
export const getBlogs = async ({ search, page = 1, limit = 6, isFeatured = false }: ParamsPropsType & { isFeatured?: boolean }) => {
  try {
    await dbConnect();

    const query = {
      isPublished: true,
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }],
      }),
    } as Record<string, unknown>;

    if (isFeatured) {
      query.featured = true;
    }

    const sortOrder: { [key: string]: 1 | -1 } = {
      featured: -1,
      createdAt: -1,
    };

    const [blogs, total] = await Promise.all([
      BlogModel.find(query)
        .select('_id title description categories slug createdAt')
        .sort(sortOrder)
        .limit(limit * page)
        .lean(),
      BlogModel.countDocuments(query),
    ]);

    const hasNextPage = total > page * limit;

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      total,
      hasNextPage,
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

// Get all blogs for admin
export const getBlogsForAdmin = async ({ page = 1, limit = 20, search = '' }: { page?: number; limit?: number; search?: string }) => {
  try {
    await dbConnect();

    await requireAdmin();

    const query = {
      ...(search && {
        $or: [{ title: { $regex: search, $options: 'i' } }],
      }),
    };

    const [blogs, total] = await Promise.all([
      BlogModel.find(query)
        .select('_id title categories createdAt updatedAt slug')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      BlogModel.countDocuments({
        ...(search && query),
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

// Create a new blog
export async function createBlog({ data, path }: { data: IBlog; path: string }) {
  try {
    await dbConnect();

    await requireAdmin();

    const newBlog = new Blog({ ...data });
    await newBlog.save();

    revalidatePath(path);
    revalidateTag('blogs');
    revalidateTag('blog-by-slug');
    revalidateTag('admin-blogs');

    return JSON.parse(JSON.stringify(newBlog));
  } catch (error) {
    console.error('Error creating blog:', error);
    throw new Error('Failed to create blog');
  }
}

// Update an existing blog
export async function updateBlog({ blogId, data, path }: { blogId: string; data: IBlog; path: string }) {
  try {
    await dbConnect();

    await requireAdmin();

    const updatedBlog = await Blog.findOneAndUpdate({ _id: objectId(blogId) }, data, { new: true });

    if (!updatedBlog) {
      throw new Error('Blog not found');
    }

    revalidatePath(path);
    revalidateTag('blogs');
    revalidateTag('blog-by-slug');
    revalidateTag('admin-blogs');

    return JSON.parse(JSON.stringify(updatedBlog));
  } catch (error) {
    console.error('Error updating blog:', error);
    throw new Error('Failed to update blog');
  }
}

export async function getBlogBySlug(slug: string, isAdmin: boolean = false) {
  try {
    await dbConnect();

    const query = { slug };

    if (!isAdmin) {
      Object.assign(query, { isPublished: true });
    }

    const blog = await Blog.findOne(query);

    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
}

// Delete a blog
export async function deleteBlog({ blogId, path }: { blogId: string; path: string }) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await Blog.findOneAndDelete({
      _id: objectId(blogId),
    });

    if (!result) {
      throw new Error('Blog not found');
    }

    revalidatePath(path);
    revalidateTag('blogs');
    revalidateTag('blog-by-slug');
    revalidateTag('admin-blogs');

    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw new Error('Failed to delete blog');
  }
}

// Delete multiple blogs
export async function deleteBlogs(ids: string[]) {
  try {
    await dbConnect();

    await requireAdmin;

    const result = await Blog.deleteMany({
      _id: { $in: ids.map((id) => objectId(id)) },
    });

    if (result.deletedCount === 0) {
      throw new Error('No blogs were deleted');
    }

    revalidatePath('/admin/blogs');
    revalidateTag('blogs');
    revalidateTag('blog-by-slug');
    revalidateTag('admin-blogs');
  } catch (error) {
    console.error('Error deleting blogs:', error);
    throw new Error('Failed to delete blogs');
  }
}
