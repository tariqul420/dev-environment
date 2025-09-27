export const revalidate = 60;

import NotFound from '@/app/not-found';
import BlogForm from '@/components/dashboard/admin/blog-form';
import { BreadcrumbContainer } from '@/components/global/breadcrumb-container';
import { getBlogBySlug } from '@/lib/actions/blog.action';

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const blog = await getBlogBySlug(decodedSlug);

  if (!blog) return <NotFound />;

  return (
    <section>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="container mx-auto max-w-4xl px-5 py-6">
          <BreadcrumbContainer className="mb-4" items={[{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/admin' }, { label: 'Update Blog' }]} />
          <BlogForm blog={blog} />
        </div>
      </div>
    </section>
  );
}
