export const dynamic = "force-dynamic";

import DataTable from "@/components/dashboard/data-table";
import { adminPaymentsColumns } from "@/components/dashboard/table-columns";
import { deletePayments, getPaymentsForAdmin } from "@/lib/actions/payment.action";

import {
  getProjectsForAdmin,
} from "@/lib/actions/project.action";

export default async function Payments({ searchParams }) {
     const { pageSize, pageIndex, search } = await searchParams;
 

 
  const { projects, pagination } = await getPaymentsForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });

 
 

  return (
     <DataTable
        pageIndex={Number(pageIndex || '1')}
        pageSize={Number(pageSize || '20')}
        total={pagination?.totalItems || 0}
        data={projects || []}
        columns={adminPaymentsColumns || []}
        uniqueIdProperty="_id"
        onDeleteMany={deletePayments}
        actionLink={{
          href: '/admin/payments/add',
          label: 'Add Payment',
        }}
      />
  );
}
