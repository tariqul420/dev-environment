export const dynamic = 'force-dynamic';

import FilterBar from '@/components/global/filter-bar';
import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import BlogCard from '@/components/root/blog-card';
import { getBlogs } from '@/lib/actions/blog.action';
import { SearchParamsProps } from '@/types';
import { BlogCardProps } from '@/types/blog';

export default async function Page({ searchParams }: SearchParamsProps) {
  const { search, page } = await searchParams;

  const { blogs = [], hasNextPage = false } = await getBlogs({
    search: search?.trim(),
    page: Number(page) || 1,
    limit: 12,
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <FilterBar breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blogs' }, { label: `Page ${Number(page) || 1}` }]} placeholder="Search blogs ..." />
      <div className="grid gap-6">
        {blogs.length > 0 ? (
          <>
            {blogs.map((blog: BlogCardProps) => (
              <BlogCard key={blog.slug} blog={blog} />
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
