import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogs } from '@/lib/actions/blog.action';
import { SearchParamsProps } from '@/types';
import Link from 'next/link';

export default async function page({ searchParams }: SearchParamsProps) {
  const { search, page, sort } = await searchParams;

  const [{ blogs = [], hasNextPage = false }] = Promise.all([
    getBlogs({
      search: search?.trim(),
      page: Number(page) || 1,
      limit: 12,
      sort: sort || 'default',
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="grid gap-6">
        {blogs.length > 0 ? (
         <section>
          blogs.map((blog) => (
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

            {hasNextPage && <LoadMore hasNextPage={hasNextPage} />}
          </section>
        ) : (
          <NoResults
                className="col-span-full"
                title="No Blogs Found"
                description="We couldn't find what you're looking for. Try adjusting your filters or search terms."
              />
        )}
      </div>
    </div>
  );
}
