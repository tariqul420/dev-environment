import DataTable from "@/components/dashboard/data-table";
import {
  deleteServices,
  getServiceForAdmin,
} from "@/lib/actions/service.action";

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
        data={service || []}
        columns={adminProjectsColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deleteServices}
        actionLink={{
          href: "/admin/brta-services/add-service",
          label: "Add Service",
        }}
      />
    </>
  );
}
