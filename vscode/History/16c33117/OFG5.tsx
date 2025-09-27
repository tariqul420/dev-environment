"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploaderField from "@/components/global/form-field/image-uploader-field";
import { InputField } from "@/components/global/form-field/input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import TiptapEditorField from "@/components/global/form-field/tiptap-editor-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createBlog, updateBlog } from "@/lib/actions/blog.action";
import logger from "@/lib/logger";
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
          path: pathname as string,
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
            logger.error("Error updating blog:", error);
            return "Failed to update blog.";
          },
        },
      );
    } else {
      toast.promise(createBlog({ data: values, path: pathname as string }), {
        loading: "Creating blog...",
        success: () => {
          router.refresh();
          form.reset();
          router.push("/admin/blogs", { scroll: false });
          return "Blog created successfully!";
        },
        error: (error) => {
          logger.error("Error creating blog:", error);
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
          className="col-span-1 sm:col-span-2"
        />

        {/* Description */}
        <TextareaField
          name="description"
          label="Description"
          placeholder="Enter blog description"
          minHeight="min-h-[200px]"
        />

        {/* Thumbnail */}
        <ImageUploaderField
          name="image"
          label="Thumbnail URL"
          multiple={false}
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
