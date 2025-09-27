import { getServiceSlug } from "@/lib/actions/service.action";

export default async function page({ params }) {
  const { id } = await params;

  const service = await getServiceSlug(id);

  if (!service) return null;

  return <div>page</div>;
}
