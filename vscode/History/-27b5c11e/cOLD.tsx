import { Skeleton } from '../ui/skeleton';

export default function ProjectFormLoading() {
  return (
    <div className="container mx-auto max-w-4xl overflow-hidden py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>

      {/* Form skeletons: mimic the grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <Skeleton className="h-10 w-full" /> {/* Project Title */}
        <Skeleton className="h-10 w-full" /> {/* Live URL */}
        <Skeleton className="h-10 w-full" /> {/* GitHub URL */}
        <Skeleton className="h-10 w-full" /> {/* Launch Date */}
        <Skeleton className="h-10 w-full" /> {/* Display Order */}
        <Skeleton className="h-10 w-full" /> {/* Tags */}
        <Skeleton className="h-10 w-full" /> {/* Technologies */}
        <Skeleton className="h-10 w-full" /> {/* Category */}
        <Skeleton className="h-24 w-full col-span-2" /> {/* Screenshots */}
        <Skeleton className="h-24 w-full" /> {/* Short Description */}
        <Skeleton className="h-40 w-full" /> {/* Cover Image */}
        <Skeleton className="h-24 w-full" /> {/* Impact */}
        <Skeleton className="h-24 w-full" /> {/* Features */}
        <Skeleton className="h-24 w-full" /> {/* Key Highlights */}
        <Skeleton className="h-24 w-full" /> {/* Future Plans */}
        <div className="flex items-center gap-4 col-span-2">
          <Skeleton className="h-5 w-5 rounded" /> {/* isFeatured */}
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-5 rounded" /> {/* isPublished */}
          <Skeleton className="h-5 w-28 rounded" />
        </div>
        <Skeleton className="h-40 w-full col-span-2" /> {/* TiptapEditorField (description) */}
        <Skeleton className="h-12 w-full col-span-2 rounded-lg" /> {/* Submit Button */}
      </div>
    </div>
  );
}
