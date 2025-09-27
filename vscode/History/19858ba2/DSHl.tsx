// app/blogs/page.tsx

import SearchInput from '@/components/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllMdxBlogs } from '@/lib/get-mdx-blogs';
import Link from 'next/link';

interface Blog {
  slug: string;
  title: string;
  description: string;
}

export default async function BlogsPage({ searchParams }) {
  const { query } = await searchParams;
  const blogs = (await getAllMdxBlogs()).filter(Boolean) as Blog[];

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(query.toLowerCase()) || blog.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <SearchInput />

      <div className="max-w-5xl mx-auto py-12">
        <div className="grid  gap-6">
          {filteredBlogs.map((blog) => (
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
    </>
  );
}
