import { Skeleton } from "@/components/ui/skeleton";

export default function ContentLoading() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-10 w-[300px]" />
          <Skeleton className="mx-auto h-4 w-[400px]" />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
