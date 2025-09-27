'use client';

import { createDragColumn, createSelectionColumn } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { BlogRecord, ProjectRecord } from '@/types/table-columns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import AdminBlogTableMenu from './admin/admin-blog-table-menu';
import AdminProjectTableMenu from './admin/admin-project-table-menu';

// blog columns for admin
export const adminBlogsColumns: ColumnDef<BlogRecord>[] = [
  createDragColumn<BlogRecord>(),
  createSelectionColumn<BlogRecord>(),
  {
    accessorKey: 'Title',
    header: 'Title',
    cell: ({ row }: { row: Row<BlogRecord> }) => <h2 className="max-w-36 truncate text-sm font-medium">{row.original.title}</h2>,
    filterFn: 'includesString',
    enableHiding: false,
  },
  {
    accessorKey: 'Category',
    header: 'Category',
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="max-w-56 truncate text-sm">
        {Array.isArray(row.original.categories) && row.original.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {row.original.categories.map((category: string) => (
              <Badge key={category} variant="outline" className="text-xs font-normal">
                #{category}
              </Badge>
            ))}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'Published',
    header: 'Published',
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.isPublished ? 'Published' : 'Unpublished'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Featured',
    header: 'Featured',
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.featured ? 'Featured' : 'Normal'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Updated At',
    header: 'Updated At',
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {format(new Date(row.original.updatedAt), 'PPP')}
        </Badge>
      </div>
    ),
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => <AdminBlogTableMenu row={row} />,
  },
];

// blog columns for admin
export const adminProjectsColumns: ColumnDef<ProjectRecord>[] = [
  createDragColumn<ProjectRecord>(),
  createSelectionColumn<ProjectRecord>(),
  {
    accessorKey: 'Title',
    header: 'Title',
    cell: ({ row }: { row: Row<ProjectRecord> }) => <h2 className="max-w-36 truncate text-sm font-medium">{row.original.title}</h2>,
    filterFn: 'includesString',
    enableHiding: false,
  },
  {
    accessorKey: 'Featured',
    header: 'Featured',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {row.original.featured ? 'Featured' : 'Normal'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Order',
    header: 'Order',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          #{row.original.order}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Live URL',
    header: 'Live URL',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          #{row.original.order}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Updated At',
    header: 'Updated At',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 py-1">
          {format(new Date(row.original.updatedAt), 'PPP')}
        </Badge>
      </div>
    ),
  },
  {
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => <AdminProjectTableMenu row={row} />,
  },
];
