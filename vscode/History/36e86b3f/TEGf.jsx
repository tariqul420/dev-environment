import DataTable from "@/components/dashboard/data-table";
import { getServiceForAdmin } from "@/lib/actions/service.action";

export default async function page() {
  const { service, pagination } = await getServiceForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });
  return (
    <>
      <DataTable
        pageIndex={Number(pageIndex || "1")}
        pageSize={Number(pageSize || "20")}
        total={pagination?.totalItems || 0}
        data={projects || []}
        columns={adminProjectsColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deleteProjects}
        actionLink={{
          href: "/admin/projects/add-project",
          label: "Add Project",
        }}
      />
    </>
  );
}
