'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchInput from './search-input';

interface Blog {
  slug: string;
  title: string;
  description: string;
}

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(query) || blog.description.toLowerCase().includes(query));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <SearchInput />
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
