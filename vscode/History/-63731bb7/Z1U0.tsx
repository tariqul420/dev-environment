export const dynamic = 'force-dynamic';

import AnimationContainer from '@/components/global/animation-container';
import FilterBar from '@/components/global/filter-bar';
import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import ProjectCard from '@/components/root/project-card';
import { getProjects } from '@/lib/actions/project.action';
import { SearchParamsProps } from '@/types';
import { ProjectCardProps } from '@/types/project';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Tariqul Islam',
  description: "Explore Tariqul Islam's portfolio projects – modern web applications, case studies, and creative solutions built with Next.js, TypeScript, MongoDB, and more.",
  keywords: ['Tariqul Islam', 'Portfolio Projects', 'Full-Stack Developer', 'Next.js', 'React', 'TypeScript', 'MongoDB', 'Software Engineer', 'Case Studies', 'Web Development'],
  openGraph: {
    title: 'Projects | Tariqul Islam Portfolio',
    description: "Browse Tariqul Islam's portfolio projects including full-stack web applications, creative designs, and impactful solutions.",
    url: 'https://tariqul.dev/projects',
    siteName: 'Tariqul Islam Portfolio',
    images: [
      {
        url: 'https://tariqul.dev/og/projects.png', // 👉 create a custom OG image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Tariqul Islam Portfolio Projects',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Tariqul Islam Portfolio',
    description: "Discover Tariqul Islam's portfolio projects – full-stack applications, designs, and impactful case studies.",
    images: ['https://tariqul.dev/og/projects.png'],
  },
};

export default async function page({ searchParams }: SearchParamsProps) {
  const { search, page } = await searchParams;

  const { projects = [], hasNextPage = false } = await getProjects({
    search: search?.trim(),
    page: Number(page) || 1,
    limit: 20,
  });

  return (
    <section className="py-12">
      <FilterBar breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Project', href: '/projects' }, { label: `Page ${Number(page) || 1}` }]} placeholder="Search Projects ..." />

      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:grid-cols-4 mt-8">
            {projects &&
              projects?.map((project: ProjectCardProps, index: number) => (
                <AnimationContainer key={index} delay={0.2 * index}>
                  <ProjectCard project={project} />
                </AnimationContainer>
              ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <LoadMore hasNextPage={hasNextPage} />
            </div>
          )}
        </>
      ) : (
        <NoResults className="max-w-4xl mx-auto" title="No Projects Found" description="We couldn't find what you're looking for. Try adjusting your filters or search terms." />
      )}
    </section>
  );
}
