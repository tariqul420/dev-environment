import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);
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
