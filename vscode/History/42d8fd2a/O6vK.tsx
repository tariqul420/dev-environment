import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

const components = {
  h1: (props: any) => <h1 className="text-2xl font-bold my-4" {...props} />,
  p: (props: any) => <p className="text-base leading-7 mb-4" {...props} />,
};

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{blog.frontmatter.date}</p>
      <MDXRemote source={mdxSource} components={components} />
    </div>
  );
}
