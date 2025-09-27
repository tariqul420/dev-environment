export const revalidate = 60;

import BackBtn from '@/components/back-btn';
import AnimationContainer from '@/components/global/animation-container';
import ContentContainer2 from '@/components/global/content-container';
import ImageGallery from '@/components/image-gallery';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ProjectDockIcon } from '@/components/project-dock-icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectBySlug } from '@/lib/actions/project.action';
import { SlugParams } from '@/types';
import { IProject } from '@/types/project';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Code2, Globe, Sparkles, Target } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '') || 'https://tariqul.dev';

const stripHtml = (html?: string) =>
  (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (text: string, n = 160) => (text.length > n ? `${text.slice(0, n - 1)}…` : text);

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    const canonicalNF = `${SITE_URL}/projects/${slug}`;
    return {
      metadataBase: new URL(SITE_URL),
      title: 'Project Not Found | Tariqul Islam',
      description: 'Sorry, this project could not be found.',
      robots: { index: false, follow: false },
      alternates: { canonical: canonicalNF },
    };
  }

  const title = `${project.title} | Tariqul Islam`;
  const rawDesc = project.shortDescription || stripHtml(project.description) || 'A portfolio project by Tariqul Islam.';
  const description = truncate(rawDesc, 160);

  const canonical = `${SITE_URL}/projects/${project.slug}`;

  const rawOg = project.coverImage || project.screenshots?.[0] || '/assets/og/projects.png';
  const ogImage = rawOg.startsWith('http') ? rawOg : `${SITE_URL}${rawOg}`;

  const publishedTime = project.launchDate ? new Date(project.launchDate).toISOString() : project.createdAt ? new Date(project.createdAt).toISOString() : undefined;

  const modifiedTime = project.updatedAt ? new Date(project.updatedAt).toISOString() : publishedTime;

  const shouldIndex = Boolean(project.isPublished);

  const keywords = [
    'Tariqul Islam projects',
    'Portfolio project',
    'Full-stack',
    'Next.js',
    'React',
    'TypeScript',
    ...(project.technologies || []),
    ...(project.categories || []),
    ...(project.tags || []),
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
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
    keywords,
    openGraph: {
      type: 'article',
      url: canonical,
      siteName: 'tariqul.dev',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
      locale: 'en_US',
      // model-driven fields
      section: project.categories?.[0],
      tags: project.tags,
      publishedTime,
      modifiedTime,
      authors: ['Tariqul Islam'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@tariqul_420',
    },
    category: 'Portfolio Project',
    applicationName: 'tariqul.dev',
  };
}

export default async function ProjectDetails({ params }: SlugParams) {
  const { slug } = await params;
  const project: IProject = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="my-12 max-w-4xl mx-auto">
        <Card className="bg-card text-foreground">
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
    <div className="my-6 space-y-16">
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* cover image */}
        <AnimationContainer delay={0.2}>
          <div className="relative w-full aspect-square overflow-hidden rounded-md">
            <Image
              src={project.coverImage}
              alt="Cover image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority
              quality={95}
            />
          </div>
        </AnimationContainer>

        {/* Title & Short Description */}
        <div className="space-y-8">
          <BackBtn className="mb-4" />
          <AnimationContainer delay={0.3}>
            <TextAnimate animation="fadeIn" by="character" delay={0} duration={0.5} className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {project.title}
            </TextAnimate>
          </AnimationContainer>

          {project.shortDescription && (
            <AnimationContainer delay={0.4}>
              <TextAnimate className="text-lg leading-relaxed text-muted-foreground">{project.shortDescription}</TextAnimate>
            </AnimationContainer>
          )}

          {project.description && (
            <AnimationContainer delay={0.6}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ArrowRight className="w-6 h-6 text-primary" />
                  Description
                </h2>
                <ContentContainer2 content={project.description} />
              </div>
            </AnimationContainer>
          )}

          <AnimationContainer delay={0.5}>
            <ProjectDockIcon live={project.liveUrl} github={project.github} />
          </AnimationContainer>
        </div>
      </div>

      {project.screenshots && project.screenshots.length > 0 && (
        <AnimationContainer delay={0.25}>
          <ImageGallery images={project.screenshots} name={project.title} />
        </AnimationContainer>
      )}

      {/* Project Overview */}
      <AnimationContainer delay={0.2}>
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-primary" />
            Project Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-semibold">Timeline</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium shrink-0">Categories:</span>
                    {project.categories.length ? (
                      <div className="flex flex-wrap gap-2">
                        {project.categories.map((c) => (
                          <Badge key={c} variant="secondary" className="capitalize">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Launch Date:</span>
                    <span className="text-muted-foreground">{format(new Date(project.launchDate), 'PPP')}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="w-5 h-5" />
                  <h3 className="font-semibold">Tags</h3>
                </div>
                <div>
                  {project.tags && project.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">N/A</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimationContainer>

      {/* Key Highlights */}
      {project.keyHighlights && project.keyHighlights.length > 0 && (
        <AnimationContainer delay={0.3}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Key Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.keyHighlights.map((highlight, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex justify-center text-primary mt-1 items-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{highlight}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <AnimationContainer delay={0.4}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{feature}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}

      {/* Impact */}
      {project.impact && (
        <AnimationContainer delay={0.6}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Impact
            </h2>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-lg leading-relaxed">{project.impact}</p>
              </div>
            </Card>
          </div>
        </AnimationContainer>
      )}

      {/* Future Plans */}
      {project.futurePlans && project.futurePlans.length > 0 && (
        <AnimationContainer delay={0.7}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Future Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.futurePlans.map((plan, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                      <Target className="w-4 h-4" />
                    </div>
                    <p className="text-lg">{plan}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </AnimationContainer>
      )}
    </div>
  );
}
