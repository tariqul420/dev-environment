export const revalidate = 60;

import ProjectForm from "@/components/dashboard/admin/project-form";
import { BreadcrumbContainer } from "@/components/globals/breadcrumb-container";

export default async function EditPayment({ params }) {
  const { id } = await params;
  const decodedSlug = decodeURIComponent(id);

  const project = await getProjectBySlug(decodedSlug, true);

  if (!project) return null;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="container mx-auto max-w-4xl px-5 py-6">
        <BreadcrumbContainer
          className="mb-4"
          items={[
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/admin" },
            { label: "Update project" },
          ]}
        />
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
