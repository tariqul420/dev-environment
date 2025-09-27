import { getBlogBySlug } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = getBlogBySlug(params.slug);

  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="prose dark:prose-invert max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold">{blog.frontmatter.title}</h1>
      <p className="text-sm text-gray-500">{blog.frontmatter.date}</p>
      <MDXRemote source={mdxSource} />
    </div>
  );
}
