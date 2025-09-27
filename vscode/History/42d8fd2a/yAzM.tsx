import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) return notFound();

  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.frontmatter.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{blog.frontmatter.date}</p>
      <article className="prose dark:prose-invert">
        <MDXRemote source={mdxSource} />
      </article>
    </div>
  );
}
