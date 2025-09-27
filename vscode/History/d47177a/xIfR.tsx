"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview, updateReview } from "@/lib/actions/review.action";
import { IReview } from "@/types/review";

// Define Zod schema for review
const formSchema = z.object({
  userId: z.string().optional(),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1.0." })
    .max(5, { message: "Rating cannot exceed 5.0." }),
  image: z
    .string()
    .url({ message: "Image must be a valid URL." })
    .min(1, { message: "Image is required." }),
  review: z
    .string()
    .min(5, { message: "Review must be at least 5 characters long." })
    .max(200, { message: "Review cannot exceed 200 characters." }),
});

type ReviewFormData = z.infer<typeof formSchema>;

interface ReviewFormProps {
  review?: IReview & { _id: string };
  productSlug: string;
}

export default function ReviewForm({ review, productSlug }: ReviewFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoverRating, setHoverRating] = useState(0);

  // Define form
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: review?.userId || "",
      rating: review?.rating || 0,
      image: review?.image || "",
      review: review?.review || "",
    },
  });

  // Define submit handler
  async function onSubmit(values: ReviewFormData) {
    try {
      const reviewData = { ...values, product: productSlug };

      if (review) {
        await toast.promise(
          updateReview({
            reviewId: review._id,
            data: reviewData,
            path: pathname,
          }),
          {
            loading: "Updating review...",
            success: (updatedReview) => {
              const newPath = `/admin/products/${productSlug}/${updatedReview._id}`;
              router.push(newPath, { scroll: false });
              router.refresh();
              return "Review updated!";
            },
            error: (error) => {
              console.error("Error updating review:", error);
              return "Failed to update review.";
            },
          },
        );
      } else {
        await toast.promise(
          createReview({
            data: reviewData,
            path: pathname,
          }),
          {
            loading: "Creating review...",
            success: () => {
              router.refresh();
              form.reset();
              router.push(`/admin/products/${productSlug}`, { scroll: false });
              return "Review created successfully!";
            },
            error: (error) => {
              console.error("Error creating review:", error);
              return "Failed to create review.";
            },
          },
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  }

  // Rating description helper
  const getRatingDescription = (rating: number, hoverRating: number) => {
    const activeRating = hoverRating || rating;
    switch (activeRating) {
      case 0:
        return "Select a rating.";
      case 1:
        return "Awful, not what I expected at all.";
      case 2:
        return "Poor, quite disappointing.";
      case 3:
        return "Average, it was okay.";
      case 4:
        return "Good, met my expectations.";
      case 5:
        return "Excellent, absolutely loved it!";
      default:
        return "Select a rating.";
    }
  };

  return (
    <div className="mx-auto max-w-[600px] p-4">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        {review ? "Edit Your Review" : "Add a New Review"}
      </h2>
      <p className="text-muted-foreground mb-4 text-center text-sm">
        {getRatingDescription(form.watch("rating"), hoverRating)}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        >
          {/* User ID */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl className="rating flex justify-center">
                  <Rating
                    onClick={(rate) => field.onChange(rate)}
                    allowFraction
                    initialValue={field.value}
                    onPointerMove={(value) => setHoverRating(value)}
                    onPointerLeave={() => setHoverRating(0)}
                    className="flex justify-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="col-span-1 sm:col-span-2">
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                    onSuccess={(result) => {
                      if (
                        result.info &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        form.setValue("image", result.info.secure_url);
                      }
                    }}
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                    }}
                  >
                    {({ open }) => (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Upload product image"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => (open ? open() : null)}
                          className="w-fit"
                        >
                          <ImageUp strokeWidth={1} />
                        </Button>
                      </div>
                    )}
                  </CldUploadWidget>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Review */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="col-span-1 sm:col-span-2">
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts... (Min 5, Max 200 characters)"
                    className="min-h-[140px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="col-span-1 flex justify-end gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setHoverRating(0);
              }}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || form.watch("rating") === 0
              }
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {review ? "Updating..." : "Posting..."}
                </>
              ) : (
                <>{review ? "Update Review" : "Post Review"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
