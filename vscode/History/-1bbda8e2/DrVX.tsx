import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogs } from '@/lib/actions/blog.action';
import { SearchParamsProps } from '@/types';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ searchParams }: SearchParamsProps) {
  const { search, page, sort } = searchParams;

  const { blogs = [], hasNextPage = false } = await getBlogs({
    search: search?.trim(),
    page: Number(page) || 1,
    limit: 12,
    sort: sort || 'default',
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid gap-6">
        {blogs.length > 0 ? (
          <>
            {blogs.map((blog) => (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{blog.description}</p>

                    {/* CreatedAt date */}
                    {blog.createdAt && (
                      <p className="text-xs flex items-center gap-2">
                        <Calendar /> Published on: {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    )}

                    {/* Categories list */}
                    {blog.categories?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {blog.categories.map((category: string) => (
                          <span key={category} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            #{category}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}

            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <LoadMore hasNextPage={hasNextPage} />
              </div>
            )}
          </>
        ) : (
          <NoResults className="col-span-full" title="No Blogs Found" description="We couldn't find what you're looking for. Try adjusting your filters or search terms." />
        )}
      </div>
    </div>
  );
}
