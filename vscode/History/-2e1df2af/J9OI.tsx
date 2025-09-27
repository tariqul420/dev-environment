'use client';

import { createDragColumn, createSelectionColumn } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { BlogRecord, ProjectRecord } from '@/types/table-columns';
import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CheckCircle, Clock, Star, XCircle } from 'lucide-react';
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
    cell: ({ row }: { row: Row<BlogRecord> }) => {
      const isPublished = row.original.isPublished;
      return (
        <div className="w-32 flex items-center gap-1 text-sm">
          {isPublished ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium">Published</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 font-medium">Unpublished</span>
            </>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: 'Featured',
    header: 'Featured',
    cell: ({ row }: { row: Row<BlogRecord> }) => {
      const isFeatured = row.original.featured;
      return (
        <div className="w-32 flex items-center gap-1 text-sm">
          {isFeatured ? (
            <>
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-600 font-medium">Featured</span>
            </>
          ) : (
            <>
              <Star className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-500">Normal</span>
            </>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: 'Updated At',
    header: 'Updated At',
    cell: ({ row }: { row: Row<BlogRecord> }) => (
      <div className="w-32 flex items-center gap-1 text-sm">
        <Clock className="h-4 w-4 text-blue-500" />
        {format(new Date(row.original.updatedAt), 'PPP')}
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
    header: 'Is Featured',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
      <div className="w-32">
        <Badge variant="outline" className="rounded px-1.5 py-1">
          {row.original.isFeatured ? 'True' : 'False'}
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
          {row.original.order}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'Category',
    header: 'Category',
    cell: ({ row }: { row: Row<ProjectRecord> }) => (
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
    id: 'Actions',
    header: 'Actions',
    cell: ({ row }) => <AdminProjectTableMenu row={row} />,
  },
];
