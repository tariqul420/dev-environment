export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminProjectsColumns } from "@/components/dashboard/table-columns";

import {
  deleteProjects,
  getProjectsForAdmin,
} from "@/lib/actions/project.action";

export default async function Projects({ searchParams }) {
  const pageIndexFromQuery = Number(searchParams?.pageIndex) || 1;
  const pageSize = Number(searchParams?.pageSize) || 5;          
  const search = searchParams?.search?.trim() || undefined;

 
  const { projects = [], pagination = { totalItems: 0 } } =
    await getProjectsForAdmin({
      limit: pageSize,
      page: pageIndexFromQuery,
      search,
    });

 
  const pageIndexForTable = Math.max(pageIndexFromQuery - 1, 0);

  return (
    <DataTable
      pageIndex={pageIndexForTable}
      pageSize={pageSize}
      total={pagination?.totalItems ?? 0}
      data={projects}
      columns={adminProjectsColumns}
      uniqueIdProperty="_id"
      onDeleteMany={deleteProjects}
      actionLink={{
        href: "/admin/projects/add-project",
        label: "Add Project",
      }}
    />
  );
}
