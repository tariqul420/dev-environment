import { Skeleton } from '../ui/skeleton';

export default function BlogFormLoading() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>
      {/* Blog form skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full col-span-2" />
        <Skeleton className="h-40 w-full col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full col-span-2" />
        <Skeleton className="h-40 w-full col-span-2" />
        <div className="flex items-center gap-4 col-span-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-28 rounded" />
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <Skeleton className="h-12 w-full col-span-2 rounded-lg" />
      </div>
    </div>
  );
}
