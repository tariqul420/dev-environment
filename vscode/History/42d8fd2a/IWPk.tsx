import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug); // ✅ now async
  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{blog.frontmatter.date}</p>
      <MDXRemote source={mdxSource} components={{}} />
    </div>
  );
}
