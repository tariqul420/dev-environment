import BackBtn from '@/components/back-btn';
import AnimationContainer from '@/components/global/animation-container';
import BlogDetailsClient from '@/components/root/blog-details-client';
import LikeButtonClient from '@/components/root/like-button-client';
import RenderTiptapContent from '@/components/tiptap-editor/render-tiptap-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogBySlug } from '@/lib/actions/blog.action';
import { SlugParams } from '@/types';
import { IBlog } from '@/types/blog';
import { format } from 'date-fns';
import { CalendarIcon, EyeIcon, TagIcon } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') || 'https://tariqul.dev';

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const blog = (await getBlogBySlug(slug)) as IBlog | null;

  if (!blog) {
    const canonicalNF = `${SITE_URL}/blogs/${slug}`;
    return {
      metadataBase: new URL(SITE_URL),
      title: 'Blog Not Found | Tariqul Islam',
      description: 'Sorry, this blog post could not be found.',
      robots: { index: false, follow: false },
      alternates: { canonical: canonicalNF },
    };
  }

  const title = blog.seo?.title || blog.title || 'Blog | Tariqul Islam';
  const description = blog.seo?.description || blog.description || 'Read blog posts by Tariqul Islam.';
  const keywords = blog.seo?.keywords?.length ? blog.seo.keywords : [...(blog.tags || []), ...(blog.categories || [])];

  const canonical = `${SITE_URL}/blogs/${blog.slug}`;

  const ogImage = blog.seo?.ogImage || blog.coverImage || '/assets/og/blogs.png';
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  const publishedTime = blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined;
  const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime;

  const shouldIndex = Boolean(blog.isPublished);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'tariqul.dev',
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      section: blog.categories?.[0],
      tags: blog.tags,
      publishedTime,
      modifiedTime,
      authors: ['Tariqul Islam'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@tariqul_420',
    },
    category: 'Blog',
    applicationName: 'tariqul.dev',
  };
}

export default async function BlogPage({ params }: SlugParams) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="my-12">
        <Card className="bg-card text-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Blog Not Found</h2>
            <p className="text-lg text-muted-foreground mb-6">Sorry, we couldn&apos;t find the blog you&apos;re looking for. It might have been removed or the URL might be incorrect.</p>
            <AnimationContainer className="flex items-center justify-center">
              <BackBtn />
            </AnimationContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <BlogDetailsClient slug={slug} />

      <div className="mx-auto py-10">
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

          <LikeButtonClient blogId={blog._id} initialLikes={blog.likes ?? 0} />
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
    </>
  );
}
