export const dynamic = 'force-dynamic';

import DataTable from '@/components/dashboard/data-table';
import { adminProjectsColumns } from '@/components/dashboard/table-columns';

import { deleteProjects, getProjectsForAdmin } from '@/lib/actions/project.action';
import { DashboardSearchParamsProps } from '@/types';

export default async function Projects({ searchParams }: DashboardSearchParamsProps) {
  const { pageSize, pageIndex, search } = await searchParams;

  const { projects, pagination } = await getProjectsForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

  return (
    <section>
      <DataTable
        pageIndex={Number(pageIndex || '1')}
        pageSize={Number(pageSize || '20')}
        total={pagination?.totalItems || 0}
        data={projects || []}
        columns={adminProjectsColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deleteProjects}
        actionLink={{
          href: '/admin/blogs/add-blog',
          label: 'Add Blog',
        }}
      />
    </section>
  );
}
