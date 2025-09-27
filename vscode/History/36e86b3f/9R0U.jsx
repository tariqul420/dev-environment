import { getServiceForAdmin } from "@/lib/actions/service.action";

export default async function page() {
  const { ser, pagination } = await getServiceForAdmin({
    limit: Number(pageSize || 20),
    page: Number(pageIndex || 1),
    search: search?.trim(),
  });
  return <div>page</div>;
}
