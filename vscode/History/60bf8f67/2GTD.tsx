import ProjectForm from '@/components/dashboard/admin/project-form';
import { BreadcrumbContainer } from '@/components/global/breadcrumb-container';

export default async function AddBlog() {
  return (
    <div className="container mx-auto max-w-4xl overflow-hidden">
      <BreadcrumbContainer className="mb-4" items={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/admin' }, { label: 'Add Blog' }]} />
      <ProjectForm />
    </div>
  );
}
