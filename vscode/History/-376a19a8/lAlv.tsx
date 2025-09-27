import { ProjectCardProps } from '@/types/project';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import NoResults from '../global/no-results';
import MagicButton from '../magic-button';
import ProjectCard from '../root/project-card';

const ProjectSection = ({ projects }: { projects: ProjectCardProps[] }) => {
  return (
    <section id="projects" className="pt-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <AnimationContainer delay={0.2}>
          <BadgeTitle title="Projects" />
        </AnimationContainer>

        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-8">
              {projects.map((project, index) => (
                <AnimationContainer key={index} delay={0.2 * index}>
                  <ProjectCard project={project} />
                </AnimationContainer>
              ))}
            </div>

            <AnimationContainer delay={0.2}>
              <MagicButton href="/projects" type="shiny" className="mt-6">
                See all Projects
              </MagicButton>
            </AnimationContainer>
          </>
        ) : (
          <NoResults className="min-w-4xl" title="No Projects Found" description="We couldn't find what you're looking for. Try adjusting your filters or search terms." />
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
