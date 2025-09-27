import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pt-12">
      <section className="bg-card text-card-foreground rounded-lg border shadow-sm">
        <div className="bg-primary/5 relative pb-12">
          <div className="bg-primary/10 absolute -top-4 -right-4 h-24 w-24 rotate-12 transform rounded-full" />
          <div className="bg-primary/10 absolute -bottom-4 -left-4 h-24 w-24 -rotate-12 transform rounded-full" />
          <div className="relative pt-4">
            <div className="bg-background mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="mx-auto h-8 w-96" />
            <Skeleton className="mx-auto mt-2 h-4 w-80" />
            <Skeleton className="mx-auto mt-2 h-4 w-72" />
            <div className="mt-6 flex justify-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="en space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-primary/5 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <CardTitle className="text-lg">Order Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <CardTitle className="text-lg">
                    Shipping Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
        <CardFooter className="bg-primary/5 flex flex-col space-y-4 border-t p-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </CardFooter>
      </section>

      <section className="mt-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
