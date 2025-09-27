import { getAllBlogs } from '@/lib/blog';
import Link from 'next/link';

export default async function BlogListPage() {
  const posts = await getAllBlogs();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-4">
            <Link href={`/blogs/${post.slug}`}>
              <h2 className="text-xl font-semibold hover:underline">{post.frontmatter.title}</h2>
              <p className="text-gray-500 text-sm">{post.frontmatter.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
