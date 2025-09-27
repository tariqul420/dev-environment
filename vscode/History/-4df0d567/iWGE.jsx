import NoResults from "@/components/globals/no-results";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProjectCard from "../project-card";

const ProjectSection = ({ projects }) => {
  return (
    <section id="projects" className="pt-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Featured Projects
        </h2>

        {projects.length > 0 ? (
          <>
            <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            <Link href="/projects">
              <Button variant="outline" className="group">
                See all Projects{" "}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
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

export default ProjectSection;
