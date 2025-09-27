import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 p-4">
      {/* Hero Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
