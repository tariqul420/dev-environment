import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full lg:w-3/4">
          {/* Top Navigation Bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* blogs grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden w-full md:w-1/4 lg:block">
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold uppercase">
              FEATURED PRODUCTS
            </h2>
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border p-2 shadow-sm"
                >
                  <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold uppercase">
              PRODUCT CATEGORIES
            </h2>
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
