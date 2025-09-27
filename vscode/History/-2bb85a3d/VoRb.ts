import mongoose from 'mongoose';

export interface IBlog {
  title: string;
  content: string;
  description: string;
  author: mongoose.Schema.Types.ObjectId | string;
  isPublished: boolean;
  slug?: string;
}

export interface BlogCardProps extends IBlog {
  createdAt: string;
}

export interface BlogParams {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
