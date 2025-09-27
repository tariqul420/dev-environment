// ✅ Add this at the top
import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

// ✅ Static Params generator (MUST HAVE for dynamic routes)
export async function generateStaticParams() {
  const slugs = getBlogSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// ✅ Page component
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);
  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{blog.frontmatter.date}</p>
      <MDXRemote source={mdxSource} components={{}} />
    </div>
  );
}
