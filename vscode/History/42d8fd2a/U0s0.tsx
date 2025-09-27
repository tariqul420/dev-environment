export default async function BlogDetailPage(context: { params: { slug: string } }) {
  const { params } = context; // ✅ await happens here safely

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
