import { BaseRecord } from '@/components/dashboard/data-table';

export interface BlogRecord extends BaseRecord {
  title: string;
  updatedAt: string;
  createdAt: string;
  slug: string;
  description: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface ProjectRecord extends BaseRecord {
  title: string;
  isFeatured: boolean;
  order: number;
  isPublished: boolean;
  updatedAt: string;
  slug: string;
}
