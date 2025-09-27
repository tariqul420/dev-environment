// app/blogs/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllMdxBlogs } from '@/lib/get-mdx-blogs';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  description: string;
}

// Next.js App Router provides searchParams as a prop
export default async function BlogsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const { query } = await searchParams;
  const blogs = (await getAllMdxBlogs()).filter(Boolean) as Blog[];

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(query) || blog.description.toLowerCase().includes(query));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
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
          ))
        ) : (
          <p className="text-muted-foreground">No blogs found.</p>
        )}
      </div>
    </div>
  );
}
