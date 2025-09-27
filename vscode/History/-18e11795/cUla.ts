import { BaseRecord } from '@/components/dashboard/data-table';

export interface BlogRecord extends BaseRecord {
  title: string;
  updatedAt: string;
  createdAt: string;
  slug: string;
  description: string;
  isPublished: boolean;
  featured: boolean;
}

export interface ProjectRecord extends BaseRecord {
  title: string;
  isFeatured: boolean;
  order: number;
  category: string;
  slug: string;
}
