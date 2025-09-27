'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import ImageUploaderField from '@/components/global/form-field/image-uploader-field';
import { InputField } from '@/components/global/form-field/input-field';
import TextareaField from '@/components/global/form-field/textarea-field';
import TiptapEditorField from '@/components/global/form-field/tiptap-editor-field';

import { CheckboxField } from '@/components/global/form-field/checkbox-field';
import { createBlog, updateBlog } from '@/lib/actions/blog.action';
import { IBlog } from '@/types/blog';

// Zod Schema
const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  content: z.string().min(10, 'Content is required'),
  coverImage: z.string().url('Cover image is required'),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().min(1).default(5),
  isPublished: z.boolean().default(false),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoOgImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  blog?: IBlog & { _id: string };
}

export default function BlogForm({ blog }: BlogFormProps) {
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
      featured: blog?.featured || false,
      seoTitle: blog?.seo?.title || '',
      seoDescription: blog?.seo?.description || '',
      seoKeywords: blog?.seo?.keywords?.join(', ') || '',
      seoOgImage: blog?.seo?.ogImage || '',
    },
  });

  const { handleSubmit, formState } = form;

  const onSubmit = async (values: FormValues) => {
    toast.promise(blog ? updateBlog({ blogId: blog._id, data: values }) : createBlog({ data: values }), {
      loading: blog ? 'Updating blog...' : 'Publishing blog...',
      success: () => {
        router.refresh();
        router.push('/admin/blogs');
        return blog ? 'Blog updated!' : 'Blog published!';
      },
      error: 'Something went wrong!',
    });
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
            form.setValue('categories', val);
          }}
        />

        <InputField
          name="tags"
          label="Tags (comma separated)"
          onChange={(e) => {
            const val = e.target.value.split(',').map((t) => t.trim());
            form.setValue('tags', val);
          }}
        />

        <TextareaField name="description" label="Short Description" minHeight="min-h-[200px]" />
        <ImageUploaderField name="coverImage" label="Cover Image" multiple={false} />

        <TiptapEditorField name="content" label="Content" className="col-span-2" />

        <InputField name="seoTitle" label="SEO Title (optional)" />
        <InputField
          name="seoKeywords"
          label="SEO Keywords (comma separated)"
          onChange={(e) => {
            const val = e.target.value.split(',').map((t) => t.trim());
            form.setValue('seoKeywords', val.join(', '));
          }}
        />
        <TextareaField name="seoDescription" label="SEO Description (optional)" minHeight="min-h-[200px]" />

        <ImageUploaderField name="seoOgImage" label="Open Graph Image (optional)" multiple={false} />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Publish blog</FormLabel>
            </FormItem>
          )}
        />

        <CheckboxField />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Feature on homepage</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={formState.isSubmitting} className="col-span-2">
          {blog ? 'Update Blog' : 'Publish Blog'}
        </Button>
      </form>
    </Form>
  );
}
