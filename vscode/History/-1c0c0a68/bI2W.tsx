'use client';

import { Calendar } from 'lucide-react';

import { BreadcrumbContainer } from '@/components/global/breadcrumb-container';
import { format } from 'date-fns';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';

import SearchBar from '../search-bar';

const FilterBar = ({ page }) => {
  const pathName = usePathname();
  const [translatedTitle, setTranslatedTitle] = useState<string>('');

  return (
    <div className="mb-6 flex min-h-[60px] flex-col justify-between rounded border-b pb-4 md:flex-row">
      <div className="left-content order-2 mt-5 flex items-center justify-between gap-4 md:order-1 md:mt-0">
        <BreadcrumbContainer
          items={[
            { label: 'Home', href: '/' },
            ...(pathName === '/project' ? [{ label: 'Project', href: '/project' }] : []),
            ...(pathName.startsWith('/blogs')
              ? [
                  { label: 'Blog', href: '/blogs' },
                  ...(blog
                    ? [
                        {
                          label: (translatedTitle || blog.title).length > 20 ? `${(translatedTitle || blog.title).slice(0, 20)}...` : translatedTitle || blog.title,
                        },
                      ]
                    : []),
                ]
              : []),
            ...(!blog ? [{ label: `Page ${page || 1}` }] : []),
          ]}
        />
      </div>
      <div className="right-content order-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center md:order-2 md:gap-5">
        {blog && (
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <p>{format(new Date(blog.createdAt), 'PPP')}</p>
          </div>
        )}
        {(pathName === '/project' || pathName === '/blogs') && (
          <>
            <div className="w-full sm:w-auto">
              <Suspense fallback={<div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />}>
                <SearchBar placeholder={pathName === '/project' ? 'Search project...' : 'Search Blogs...'} />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
