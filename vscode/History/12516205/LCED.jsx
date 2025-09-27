import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoading() {
  return (
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border">
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[80px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
