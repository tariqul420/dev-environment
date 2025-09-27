export const dynamic = "force-dynamic";

import FilterBar from "@/components/globals/filter-bar";
import LoadMore from "@/components/globals/load-more";
import NoResults from "@/components/globals/no-results";

import ProjectCard from "@/components/root/project-card";
import { getProjects } from "@/lib/actions/project.action";

export default async function page({ searchParams }) {
  const { search, page } = await searchParams;

  const { projects = [], hasNextPage = false } = await getProjects({
    search: search?.trim(),
    page: Number(page) || 1,
    limit: 20,
  });

  return (
    <section className="py-12">
      <FilterBar
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Project", href: "/projects" },
          { label: `Page ${Number(page) || 1}` },
        ]}
        placeholder="Search Projects ..."
      />

      {projects.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects &&
              projects?.map((project, index) => (
                <dev key={index}>
                  <ProjectCard project={project} />
                </dev>
              ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <LoadMore hasNextPage={hasNextPage} />
            </div>
          )}
        </>
      ) : (
        <NoResults
          className="mx-auto max-w-4xl"
          title="No Projects Found"
          description="We couldn't find what you're looking for. Try adjusting your filters or search terms."
        />
      )}
    </section>
  );
}
