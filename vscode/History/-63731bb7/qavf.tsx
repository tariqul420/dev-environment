import AnimationContainer from '@/components/global/animation-container';
import FilterBar from '@/components/global/filter-bar';
import LoadMore from '@/components/global/load-more';
import NoResults from '@/components/global/no-results';
import ProjectCard from '@/components/project-card';
import { getProjects } from '@/lib/actions/project.action';
import { SearchParamsProps } from '@/types';
import { ProjectCardProps } from '@/types/project';

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
