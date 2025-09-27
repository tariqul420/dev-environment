import { getBlogBySlug } from '@/lib/actions/blog.action';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  return {
    title: blog?.seo?.title || blog?.title || 'Blog',
    description: blog?.seo?.description || blog?.description,
    keywords: blog?.seo?.keywords,
    openGraph: {
      title: blog?.seo?.title,
      description: blog?.seo?.description,
      images: blog?.seo?.ogImage ? [blog.seo.ogImage] : [],
    },
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) return <div className="text-center py-10 text-xl">Blog not found</div>;

  return <BlogDetailsPage blog={blog} />;
}
