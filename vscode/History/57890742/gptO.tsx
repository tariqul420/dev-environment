'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { CheckboxField } from '@/components/global/form-field/checkbox-field';
import ImageUploaderField from '@/components/global/form-field/image-uploader-field';
import { InputField } from '@/components/global/form-field/input-field';
import TextareaField from '@/components/global/form-field/textarea-field';
import TiptapEditorField from '@/components/global/form-field/tiptap-editor-field';

import { createBlog, updateBlog } from '@/lib/actions/blog.action';
import { IBlog } from '@/types/blog';

const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  content: z.string().min(10, 'Content is required'),
  coverImage: z.string().url('Cover image is required'),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().min(1, 'Read time must be at least 1 minute').optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  blog?: IBlog & { _id: string };
}

export default function BlogForm({ blog }: BlogFormProps) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || '',
      description: blog?.description || '',
      content: blog?.content || '',
      coverImage: blog?.coverImage || '',
      categories: blog?.categories || [],
      tags: blog?.tags || [],
      readTime: blog?.readTime || 5,
      isPublished: blog?.isPublished || false,
      isFeatured: blog?.isFeatured || false,
      seo: {
        title: blog?.seo?.title || '',
        description: blog?.seo?.description || '',
        keywords: blog?.seo?.keywords || [],
        ogImage: blog?.seo?.ogImage || '',
      },
    },
  });

  const { handleSubmit, formState, setValue } = form;

  const onSubmit = async (values: FormValues) => {
    toast.promise(
      blog
        ? updateBlog({
            blogId: blog._id,
            data: values,
            path: pathname,
          })
        : createBlog({
            data: values,
            path: pathname,
          }),
      {
        loading: blog ? 'Updating blog...' : 'Publishing blog...',
        success: () => {
          router.refresh();
          if (!blog) {
            router.push('/admin/blogs');
          }
          return blog ? 'Blog updated!' : 'Blog published!';
        },
        error: 'Something went wrong!',
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <InputField name="title" label="Blog Title" placeholder="Enter title" />
        <InputField name="readTime" label="Estimated Read Time (min)" type="number" />

        <InputField
          name="categories"
          label="Categories (comma separated)"
          onChange={(e) => {
            const val = e.target.value.split(',').map((t) => t.trim());
            setValue('categories', val);
          }}
        />

        <InputField
          name="tags"
          label="Tags (comma separated)"
          onChange={(e) => {
            const val = e.target.value.split(',').map((t) => t.trim());
            setValue('tags', val);
          }}
        />

        <TextareaField name="description" label="Short Description" minHeight="min-h-[200px]" />
        <ImageUploaderField name="coverImage" label="Cover Image" multiple={false} />

        <TiptapEditorField name="content" label="Content" className="col-span-2" />

        <InputField name="seo.title" label="SEO Title (optional)" />
        <InputField
          name="seo.keywords"
          label="SEO Keywords (comma separated)"
          onChange={(e) => {
            const val = e.target.value.split(',').map((t) => t.trim());
            setValue('seo.keywords', val);
          }}
        />
        <TextareaField name="seo.description" label="SEO Description (optional)" minHeight="min-h-[200px]" />

        <ImageUploaderField name="seo.ogImage" label="Open Graph Image (optional)" multiple={false} />

        <CheckboxField name="isPublished" label="Publish blog" />

        <CheckboxField name="isFeatured" label="Feature on homepage" />

        <Button type="submit" disabled={!form.formState.isDirty || formState.isSubmitting} className="col-span-2">
          {blog ? 'Update Blog' : 'Publish Blog'}
        </Button>
      </form>
    </Form>
  );
}
