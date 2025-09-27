import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getBlogBySlug } from '@/lib/actions/blog.action';
import { format } from 'date-fns';
import { CalendarIcon, EyeIcon, HeartIcon, TagIcon } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
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
  const blog = await getBlogBySlug(params.slug);

  if (!blog) return <div className="text-center py-10 text-xl">Blog not found</div>;

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

      {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-auto rounded-xl mb-8" />}

      {blog.tags?.length ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              <TagIcon className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <article className="prose dark:prose-invert prose-neutral max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
}
