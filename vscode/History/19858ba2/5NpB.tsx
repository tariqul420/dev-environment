// app/blogs/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllMdxBlogs } from '@/lib/get-mdx-blogs';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  description: string;
}

export default async function BlogsPage() {
  const blogs = (await getAllMdxBlogs()).filter(Boolean) as Blog[];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">📝 My Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
            <Card className="hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{blog.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
