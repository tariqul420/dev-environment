export const revalidate = 60;
export const fetchCache = 'default-cache';

import AboutMe from '@/components/sections/about-me';
import BlogSection from '@/components/sections/blog-section';
import ContactMe from '@/components/sections/contact-me';
import Experience from '@/components/sections/experience-section';
import HeroSection from '@/components/sections/hero-section';
import ProjectSection from '@/components/sections/project-section';
import StartProject from '@/components/sections/start-project';
import TechStack from '@/components/sections/tech-stack';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogs } from '@/lib/actions/blog.action';
import { getProjects } from '@/lib/actions/project.action';
import { Suspense } from 'react';

async function Project() {
  const { projects } = await getProjects({
    limit: 8,
    isFeatured: true,
  });

  return <ProjectSection projects={projects} />;
}

async function Blog() {
  const { blogs } = await getBlogs({
    limit: 8,
    isFeatured: true,
  });

  return <BlogSection blogs={blogs} />;
}

export default async function Home() {
  // ---------- JSON-LD data ----------
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tariqul Islam',
    url: 'https://tariqul.dev',
    jobTitle: 'Web Developer & Designer',
    worksFor: { '@type': 'Organization', name: 'tariqul.dev' },
    image: 'https://tariqul.dev/assets/images/tariqul-islam.jpeg',
    sameAs: ['https://www.linkedin.com/in/tariqul-dev', 'https://github.com/tariqul_420', 'https://x.com/tariqul_420', 'https://facebook.com/tariquldev', 'https://dev.to'],
  };

  // If your site doesn't have a search page, use the homepage query param as the target
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'tariqul.dev',
    url: 'https://tariqul.dev',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://tariqul.dev/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <section className="w-full min-h-screen">
      {/* ---- JSON-LD scripts (inline) ---- */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      {/* ---- Your actual UI ---- */}
      <HeroSection />
      <AboutMe />
      <TechStack />
      <Suspense fallback={<FallbackSkeleton />}>
        <Project />
      </Suspense>
      <Suspense fallback={<FallbackSkeleton />}>
        <Blog />
      </Suspense>
      <Experience />
      <ContactMe />
      <StartProject />
    </section>
  );
}

function FallbackSkeleton() {
  return (
    <section className="pt-24">
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col items-center">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
