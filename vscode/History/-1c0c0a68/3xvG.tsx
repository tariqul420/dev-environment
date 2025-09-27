import { Suspense } from 'react';
import { BreadcrumbContainer } from './breadcrumb-container';
import SearchBar from './search-bar';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  breadcrumb: BreadcrumbItem[];
  placeholder: string;
}

export default function FilterBar({ breadcrumb, placeholder }: Props) {
  return (
    <div className="mb-6 flex min-h-[60px] flex-col justify-between rounded border-b pb-4 md:flex-row max-sm:gap-4">
      <BreadcrumbContainer items={breadcrumb} />
      <div className="w-full sm:w-auto">
        <Suspense fallback={<div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />}>
          <SearchBar placeholder={placeholder} />
        </Suspense>
      </div>
    </div>
  );
}
