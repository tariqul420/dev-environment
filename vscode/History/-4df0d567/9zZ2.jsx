import NoResults from "../global/no-results";

import ProjectCard from "../root/project-card";

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="pt-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        <h1 className="mb-12 text-center text-5xl font-bold text-white">
          Featured Projects
        </h1>

        {projects.length > 0 ? (
          <>
            <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project, index) => (
                <ProjectCard project={project} />
              ))}
            </div>

            <MagicButton href="/projects" type="shiny" className="mt-6">
              See all Projects
            </MagicButton>
          </>
        ) : (
          <NoResults
            className="min-w-4xl"
            title="No Projects Found"
            description="We couldn't find what you're looking for. Try adjusting your filters or search terms."
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
