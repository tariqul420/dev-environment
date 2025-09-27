export const revalidate = 60;

import NotFound from '@/app/not-found';
import ProjectForm from '@/components/dashboard/admin/project-form';
import { BreadcrumbContainer } from '@/components/global/breadcrumb-container';
import { getProjectBySlug } from '@/lib/actions/project.action';

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const project = await getProjectBySlug(decodedSlug);

  if (!project) return <NotFound />;

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="container mx-auto max-w-4xl px-5 py-6">
          <BreadcrumbContainer className="mb-4" items={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/admin' }, { label: 'Update project' }]} />
          <ProjectForm project={project} />
        </div>
      </div>
    </section>
  );
}
