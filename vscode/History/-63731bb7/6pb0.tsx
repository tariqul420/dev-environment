export const dynamic = 'force-dynamic';

import AnimationContainer from '@/components/global/animation-container';
import FilterBar from '@/components/global/filter-bar';
import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import ProjectCard from '@/components/root/project-card';
import { getProjects } from '@/lib/actions/project.action';
import { SearchParamsProps } from '@/types';
import { ProjectCardProps } from '@/types/project';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://tariqul.dev'),
  title: 'Projects | Tariqul Islam — Full-Stack Web Developer & Designer',
  description:
    'Explore the portfolio projects of Tariqul Islam — Full-Stack Developer & Designer from Bangladesh. Browse modern web applications, case studies, and open-source projects built with Next.js, React, TypeScript, Prisma, MongoDB, PostgreSQL and Docker.',
  keywords: [
    'Tariqul Islam projects',
    'Portfolio projects',
    'Web development case studies',
    'Next.js portfolio projects',
    'React developer projects',
    'TypeScript projects',
    'Full-stack developer Bangladesh',
    'Open-source projects',
    'UI/UX projects',
    'Modern web applications portfolio',
  ],
  alternates: { canonical: 'https://tariqul.dev/projects' },
  openGraph: {
    title: 'Projects | Tariqul Islam Portfolio',
    description: "Discover Tariqul Islam's portfolio projects including full-stack web applications, UI/UX designs, and impactful case studies.",
    url: 'https://tariqul.dev/projects',
    siteName: 'tariqul.dev',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Tariqul Islam Portfolio',
    description: "Explore Tariqul Islam's projects – full-stack apps, UI/UX designs, and impactful case studies.",
    creator: '@tariqul420',
  },
  category: 'Portfolio Projects',
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
