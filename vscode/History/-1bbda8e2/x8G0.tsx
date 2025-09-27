export const dynamic = 'force-dynamic';

import FilterBar from '@/components/global/filter-bar';
import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import BlogCard from '@/components/root/blog-card';
import { getBlogs } from '@/lib/actions/blog.action';
import { SearchParamsProps } from '@/types';
import { BlogCardProps } from '@/types/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tariqul.dev'),
  title: 'Blog | Tariqul Islam — Insights on Web Development & Design',
  description:
    'Read the latest blogs by Tariqul Islam, Full-Stack Developer & Designer from Bangladesh. Covering Next.js, React, TypeScript, UI/UX, MongoDB, PostgreSQL, Prisma, and modern web development insights.',
  keywords: [
    'Tariqul Islam blog',
    'Web development blog',
    'Next.js tutorials',
    'React guides',
    'TypeScript tips',
    'Full-stack development blog',
    'UI/UX design blog',
    'MongoDB PostgreSQL Prisma',
    'JavaScript articles',
    'Bangladesh developer blog',
  ],
  alternates: { canonical: 'https://tariqul.dev/blog' },
  openGraph: {
    title: 'Blog | Tariqul Islam — Web Development & Design Insights',
    description: 'Explore blogs by Tariqul Islam on full-stack development, Next.js, React, TypeScript, databases, and UI/UX design.',
    url: 'https://tariqul.dev/blog',
    siteName: 'tariqul.dev',
    type: 'article',
    locale: 'en_US',
    images: [
      {
        url: '/assets/og/blog.png',
        width: 1200,
        height: 630,
        alt: 'Tariqul Islam Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Tariqul Islam — Web Development & Design Insights',
    description: 'Articles by Tariqul Islam on Next.js, React, TypeScript, full-stack development, databases, and UI/UX design.',
    images: ['/assets/og/blog.png'],
    creator: '@tariqul_420',
  },
  category: 'Blog',
};

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
