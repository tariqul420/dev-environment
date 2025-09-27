'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { CheckboxField } from '@/components/global/form-field/checkbox-field';
import ImageUploaderField from '@/components/global/form-field/image-uploader-field';
import { InputField } from '@/components/global/form-field/input-field';
import SelectField from '@/components/global/form-field/select-field';
import TextareaField from '@/components/global/form-field/textarea-field';
import TiptapEditorField from '@/components/global/form-field/tiptap-editor-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { createProject, updateProject } from '@/lib/actions/project.action';
import { IProject } from '@/types/project';

// Schema
const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  description: z.string().min(10, 'Detailed description is required'),
  coverImage: z.string().url('Cover image is required'),
  screenshots: z.array(z.string().url()).optional(),
  liveUrl: z.string().url('Live URL is required'),
  github: z.string().url().optional(),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  features: z.array(z.string()).optional(),
  keyHighlights: z.array(z.string()).optional(),
  futurePlans: z.array(z.string()).optional(),
  impact: z.string().optional(),
  tags: z.array(z.string()).optional(),
  launchDate: z.string().min(1, 'Launch date is required'),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  order: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: IProject & { _id: string };
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || '',
      shortDescription: project?.shortDescription || '',
      description: project?.description || '',
      coverImage: project?.coverImage || '',
      screenshots: project?.screenshots || [],
      liveUrl: project?.liveUrl || '',
      github: project?.github || '',
      technologies: project?.technologies || [],
      features: project?.features || [],
      keyHighlights: project?.keyHighlights || [],
      futurePlans: project?.futurePlans || [],
      impact: project?.impact || '',
      tags: project?.tags || [],
      launchDate: project?.launchDate ? new Date(project.launchDate).toISOString().substring(0, 10) : '',
      category: project?.category || '',
      isFeatured: project?.isFeatured || false,
      isPublished: project?.isPublished || false,
      order: project?.order || 0,
    },
  });

  const { handleSubmit, formState, setValue } = form;

  const onSubmit = async (values: FormValues) => {
    const formattedValues: IProject = {
      ...values,
      launchDate: new Date(values.launchDate),
    };

    toast.promise(project ? updateProject({ projectId: project._id, data: formattedValues, path: pathname }) : createProject({ data: formattedValues, path: pathname }), {
      loading: project ? 'Updating project...' : 'Creating project...',
      success: () => {
        router.refresh();
        if (!project) {
          router.push('/admin/projects');
        }
        return project ? 'Project updated!' : 'Project created!';
      },
      error: 'Something went wrong!',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <InputField name="title" label="Project Title" />
        <InputField name="liveUrl" label="Live URL" type="url" />
        <InputField name="github" label="GitHub URL (optional)" type="url" />
        <InputField name="launchDate" label="Launch Date" type="date" />
        <InputField name="order" label="Display Order" type="number" />

        <InputField
          name="tags"
          label="Tags (comma separated)"
          onChange={(e) =>
            setValue(
              'tags',
              e.target.value.split(',').map((tag) => tag.trim()),
            )
          }
        />

        <InputField
          name="technologies"
          label="Technologies (comma separated)"
          onChange={(e) =>
            setValue(
              'technologies',
              e.target.value.split(',').map((tech) => tech.trim()),
            )
          }
        />

        <SelectField
          name="category"
          label="Category"
          placeholder="Select category"
          options={[
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
            { label: 'Fullstack', value: 'fullstack' },
            { label: 'Android App', value: 'android-app' },
            { label: 'iOS App', value: 'ios-app' },
            { label: 'Expo (Android + iOS)', value: 'expo' },
            { label: 'Flutter', value: 'flutter' },
            { label: 'Website', value: 'website' },
            { label: 'Landing Page', value: 'landing-page' },
            { label: 'Portfolio', value: 'portfolio' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'SaaS Platform', value: 'saas' },
            { label: 'CMS/Blog', value: 'cms' },
            { label: 'AI Tool', value: 'ai-tool' },
            { label: 'Open Source', value: 'open-source' },
            { label: 'Admin Dashboard', value: 'admin-dashboard' },
            { label: 'Others', value: 'others' },
          ]}
        />

        <ImageUploaderField name="screenshots" label="Screenshots" multiple className="col-span-2" viewClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" />

        <TextareaField name="shortDescription" label="Short Description" minHeight="min-h-[200px]" />

        <ImageUploaderField name="coverImage" label="Cover Image" multiple={false} />

        <TextareaField name="impact" label="Project Impact (optional)" placeholder="Describe the outcome/benefit" />

        <TextareaField
          name="features"
          label="Features (comma separated)"
          onChange={(e) =>
            setValue(
              'features',
              e.target.value.split(',').map((v) => v.trim()),
            )
          }
        />
        <TextareaField
          name="keyHighlights"
          label="Key Highlights"
          value={form.watch('keyHighlights')?.join(', ') || ''}
          onChange={(e) =>
            setValue(
              'keyHighlights',
              e.target.value.split(',').map((v) => v.trim()),
            )
          }
        />

        <TextareaField
          name="futurePlans"
          label="Future Plans (comma separated)"
          value={form.watch('futurePlans')?.join(', ') || ''}
          onChange={(e) =>
            setValue(
              'futurePlans',
              e.target.value.split(',').map((v) => v.trim()),
            )
          }
        />

        <CheckboxField name="isFeatured" label="Feature on Homepage" />

        <CheckboxField name="isPublished" label="Publish Project" />

        <TiptapEditorField className="col-span-2" name="description" label="Detailed Description" />

        <Button type="submit" disabled={formState.isSubmitting} className="col-span-2">
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
