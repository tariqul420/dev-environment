"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
// import { createReview, updateReview } from "@/lib/actions/review.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating.",
  }),
  review: z
    .string()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(500, { message: "Review cannot exceed 500 characters." }),
  username: z
    .string()
    .max(50, { message: "Username cannot exceed 50 characters." })
    .optional(),
  image: z.string().url({ message: "Image must be a valid URL." }).optional(),
});

type ReviewFormData = z.infer<typeof formSchema>;

interface ReviewFormProps {
  review?: IReview & { _id: string };
}

interface IReview {
  rating: string;
  review: string;
  username?: string;
  image?: string;
}

export default function ProductReviewForm({ review }: ReviewFormProps) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: review?.rating || "1", "2", "3", "4", "5",
      review: review?.review || "",
      username: review?.username || "",
      image: review?.image || "",
    },
  });

  function onSubmit(values: ReviewFormData) {
    // if (review) {
    //   toast.promise(
    //     updateReview({
    //       reviewId: review._id,
    //       data: values,
    //       path: pathname,
    //     }),
    //     {
    //       loading: "Updating review...",
    //       success: (updatedReview) => {
    //         const newPath = `/reviews/${updatedReview.id}`;
    //         router.push(newPath, { scroll: false });
    //         router.refresh();
    //         return "Review updated!";
    //       },
    //       error: (error) => {
    //         console.error("Error updating review:", error);
    //         return "Failed to update review.";
    //       },
    //     },
    //   );
    // } else {
    //   toast.promise(createReview({ data: values, path: pathname }), {
    //     loading: "Submitting review...",
    //     success: () => {
    //       router.refresh();
    //       form.reset();
    //       router.push("/reviews", { scroll: false });
    //       return "Review submitted successfully!";
    //     },
    //     error: (error) => {
    //       console.error("Error submitting review:", error);
    //       return "Failed to submit review.";
    //     },
    //   });
    // }

    console.log(values);
  }

  return (
    <TabsContent value="review">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">
          {review ? "Edit Your Review" : "Submit a Review"} for Natural SEFA
          Update
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
          >
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex justify-center space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex items-center">
                          <RadioGroupItem
                            value={value.toString()}
                            id={`rating-${value}`}
                          />
                          <FormLabel
                            htmlFor={`rating-${value}`}
                            className="ml-1"
                          >
                            {value} {value === 1 ? "Star" : "Stars"}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select a star rating for the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Text */}
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about Natural SEFA Update..."
                      className="w-full resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a review (10–500 characters) about your experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a username or leave blank for an anonymous review.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Image (Optional)</FormLabel>
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
                            placeholder="Upload an image"
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
                  <FormDescription>
                    Upload an image to accompany your review.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="col-span-1 sm:col-span-2"
              disabled={form.formState.isSubmitting}
            >
              {review ? "Update Review" : "Submit Review"}
            </Button>
          </form>
        </Form>
      </div>
    </TabsContent>
  );
}
