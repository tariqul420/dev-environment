export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminPaymentsColumns } from "@/components/dashboard/table-columns";
import { deletePayments } from "@/lib/actions/payment.action";

import {
  getProjectsForAdmin,
} from "@/lib/actions/project.action";

export default async function Payments({ searchParams }) {
     const { pageSize, pageIndex, search } = await searchParams;
 

 
  const { projects = [], pagination = { totalItems: 0 } } =
    await getProjectsForAdmin({
      limit: pageSize,
      page: pageIndex,
      search,
    });

 
  const pageIndexForTable = Math.max(pageIndexFromQuery - 1, 0);

  return (
    <DataTable
      pageIndex={pageIndexForTable}
      pageSize={pageSize}
      total={pagination?.totalItems ?? 0}
      data={projects}
      columns={adminPaymentsColumns}
      uniqueIdProperty="_id"
      onDeleteMany={deletePayments}
      actionLink={{
        href: "/admin/payments/add",
        label: "Add Payments",
      }}
    />
  );
}
