import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-full rounded-[16px] overflow-hidden border border-border">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-square rounded-t-[16px]" />

      {/* Content Skeleton */}
      <div className="flex flex-col p-4 flex-grow space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
