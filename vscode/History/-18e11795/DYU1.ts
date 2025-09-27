import { BaseRecord } from '@/components/dashboard/data-table';

export interface BlogRecord extends BaseRecord {
  title: string;
  updatedAt: string;
  createdAt: string;
  slug: string;
  description: string;
}
