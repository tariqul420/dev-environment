import RenderTiptapContent from '@/components/tiptap-editor/render-tiptap-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getBlogBySlug } from '@/lib/actions/blog.action';
import { format } from 'date-fns';
import { CalendarIcon, EyeIcon, HeartIcon, TagIcon } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return {
    title: blog?.seo?.title || blog?.title || 'Blog',
    description: blog?.seo?.description || blog?.description,
    keywords: blog?.seo?.keywords,
    openGraph: {
      title: blog?.seo?.title,
      description: blog?.seo?.description,
      images: blog?.seo?.ogImage ? [blog.seo.ogImage] : [],
    },
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="my-12 max-w-4xl mx-auto">
        <Card className="dark:bg-dark-lite dark:text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
            <p className="text-lg mb-6">Sorry, we couldn&apos;t find the project you&apos;re looking for. It might have been removed or the URL might be incorrect.</p>
            <AnimationContainer className="flex items-center justify-center">
              <BackBtn variant="default" />
            </AnimationContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{blog.title}</h1>

      <p className="text-muted-foreground mb-4">{blog.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        {blog.author?.name && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={blog.author.avatar} />
              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
            </Avatar>
            <span>{blog.author.name}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{format(new Date(blog.createdAt || ''), 'dd MMM yyyy')}</span>
        </div>

        <div className="flex items-center gap-1">
          <EyeIcon className="w-4 h-4" />
          <span>{blog.views ?? 0} views</span>
        </div>

        <div className="flex items-center gap-1">
          <HeartIcon className="w-4 h-4" />
          <span>{blog.likes ?? 0} likes</span>
        </div>
      </div>

      {blog.coverImage && (
        <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image src={blog.coverImage} alt={blog.title} fill priority sizes="(max-width: 768px) 100vw, 700px" className="object-cover" />
        </div>
      )}

      {blog.tags?.length ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary">
              <TagIcon className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <RenderTiptapContent html={blog.content} />
    </div>
  );
}
