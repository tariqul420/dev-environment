"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { InputField } from "@/components/global/form-field/input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import TiptapEditorField from "@/components/global/form-field/tiptap-editor-field";
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
import { createBlog, updateBlog } from "@/lib/actions/blog.action";
import { IBlog } from "@/types/blog";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  image: z
    .string()
    .url({ message: "Image must be a valid URL." })
    .min(1, "Image must be at least 1 url."),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." }),
});

type BlogFormData = z.infer<typeof formSchema>;

interface BlogFormProps {
  blog?: IBlog & { _id: string };
}

export default function BlogForm({ blog }: BlogFormProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<BlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || "",
      description: blog?.description || "",
      image: blog?.image || "",
      content: blog?.content || "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: BlogFormData) {
    if (blog) {
      toast.promise(
        updateBlog({
          blogId: blog._id,
          data: values,
          path: pathname,
        }),
        {
          loading: "Updating blog...",
          success: (updatedBlog) => {
            const newPath = `/admin/blogs/${updatedBlog.slug}`;
            router.push(newPath, { scroll: false });
            router.refresh();
            return "Blog updated!";
          },
          error: (error) => {
            console.error("Error updating blog:", error);
            return "Failed to update blog.";
          },
        },
      );
    } else {
      toast.promise(createBlog({ data: values, path: pathname }), {
        loading: "Creating blog...",
        success: () => {
          router.refresh();
          form.reset();
          router.push("/admin/blogs", { scroll: false });
          return "Blog created successfully!";
        },
        error: (error) => {
          console.error("Error creating blog:", error);
          return "Failed to create blog.";
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 sm:gap-8"
      >
        {/* Title */}
        <InputField
          name="title"
          label="Blog Title"
          placeholder="Enter blog title"
        />

        {/* Thumbnail */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
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
                        placeholder="Upload thumbnail"
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

        {/* Description */}
        <TextareaField
          name="description"
          label="Description"
          placeholder="Enter blog description"
          className="col-span-1 sm:col-span-2"
        />

        {/* Content */}
        <TiptapEditorField
          name="content"
          label="Content"
          className="col-span-1 sm:col-span-2"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={form.formState.isSubmitting}
        >
          {blog ? "Update Blog" : "Create Blog"}
        </Button>
      </form>
    </Form>
  );
}
