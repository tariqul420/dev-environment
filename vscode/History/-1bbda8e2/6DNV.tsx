import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogs } from '@/lib/actions/blog.action';
import { SearchParamsProps } from '@/types';
import Link from 'next/link';

export default async function page({ searchParams }: SearchParamsProps) {
  const { search, page, sort } = await searchParams;

  const [{ blogs = [], hasNextPage = false }] = await Promise.all([
    getBlogs({
      search: search?.trim(),
      page: Number(page) || 1,
      limit: 12,
      sort: sort || 'default',
    }),
  ]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
          <Card className="hover:shadow-xl transition-shadow cursor-pointer">
            {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover rounded-t-md" />}
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{blog.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>⏱️ {blog.readTime || 5} min read</span>
                <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              {blog.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {blog.categories.map((cat) => (
                    <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      #{cat}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
