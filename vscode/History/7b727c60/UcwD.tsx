export const revalidate = 60;
export const fetchCache = 'default-cache';

import AboutMe from '@/components/sections/about-me';
import Banner from '@/components/sections/banner';
import Blogs from '@/components/sections/blogs';
import ContactMe from '@/components/sections/contact-me';
import Experience from '@/components/sections/experience';
import Projects from '@/components/sections/projects';
import StartProject from '@/components/sections/start-project';
import TechStack from '@/components/sections/tech-stack';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogs } from '@/lib/actions/blog.action';
import { getProjects } from '@/lib/actions/project.action';
import { Suspense } from 'react';

async function ProjectSection() {
  const { projects } = await getProjects({
    limit: 8,
    isFeatured: true,
  });

  return <Projects projects={projects} />;
}

async function BlogSection() {
  const { blogs } = await getBlogs({
    limit: 8,
    isFeatured: true,
  });

  return <Blogs blogs={blogs} />;
}

export default async function Home() {
  const [{ projects }, { blogs }] = await Promise.all([getProjects({ limit: 8, isFeatured: true }), getBlogs({ limit: 8, isFeatured: true })]);

  return (
    <section className="w-full min-h-screen">
      <Banner />
      <AboutMe />
      <TechStack />
      <Suspense fallback={}>
        <ProjectSection />
      </Suspense>
      <Blogs blogs={blogs} />
      <Experience />
      <ContactMe />
      <StartProject />
    </section>
  );
}

function fallbackSkeleton() {
  return (
    <section className="pt-24">
      <div className="max-w-7xl mx-auto w-full px-4 flex flex-col items-center">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-8">{Array.from({ length: 8 }).map((_, idx) => {})}</div>
      </div>
    </section>
  );
}
