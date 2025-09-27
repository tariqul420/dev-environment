import { BreadcrumbContainer } from './breadcrumb-container';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function FilterBar({ breadcrumb }) {
  return (
    <div className="mb-6 flex min-h-[60px] flex-col justify-between rounded border-b pb-4 md:flex-row">
      <BreadcrumbContainer items={[]} />
      <div className="w-full sm:w-auto">
        <Suspense fallback={<div className="dark:bg-dark-lite h-10 w-32 animate-pulse rounded bg-gray-200" />}>
          <SearchBar placeholder={pathName === '/products' ? 'Search Products...' : 'Search Blogs...'} />
        </Suspense>
      </div>
    </div>
  );
}
