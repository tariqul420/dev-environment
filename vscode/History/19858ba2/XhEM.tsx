// app/blogs/page.tsx
import BlogList from '@/components/blog/blog-list';
import { getAllMdxBlogs } from '@/lib/get-mdx-blogs';

export default async function BlogsPage() {
  const blogs = (await getAllMdxBlogs()).filter(Boolean);

  return <BlogList blogs={blogs} />;
}
