import { getBlogBySlug, getBlogSlugs } from '@/lib/blog';
import { parseMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

const mdxComponents = {
  h1: (props) => <h1 className="text-2xl font-bold my-4" {...props} />,
  h2: (props) => <h2 className="text-xl font-semibold my-3" {...props} />,
  p: (props) => <p className="text-base leading-7 mb-4" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-4" {...props} />,
  a: (props) => <a className="text-blue-500 underline" {...props} />,
  code: (props) => <code className="bg-gray-800 text-white px-1 py-0.5 rounded" {...props} />,
};

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  const mdxSource = await parseMDX(blog.content);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{blog.frontmatter.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{blog.frontmatter.date}</p>

      {/* ✅ Render MDX with fallback styling */}
      <div className="text-white">
        <MDXRemote source={mdxSource} components={mdxComponents} />
      </div>
    </div>
  );
}
