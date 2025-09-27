import ServiceForm from "@/components/dashboard/admin/service-form";
import { BreadcrumbContainer } from "@/components/globals/breadcrumb-container";
import { getServiceId } from "@/lib/actions/service.action";

export default async function page({ params }) {
  const { id } = await params;

  const service = await getServiceId(id);

  if (!service) return null;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="container mx-auto max-w-4xl px-5 py-6">
        <BreadcrumbContainer
          className="mb-4"
          items={[
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/admin" },
            { label: "Update Service" },
          ]}
        />
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
