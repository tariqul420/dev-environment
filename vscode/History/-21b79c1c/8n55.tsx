import AboutMe from '@/components/sections/about-me';
import Banner from '@/components/sections/banner';
import ContactMe from '@/components/sections/contact-me';
import Experience from '@/components/sections/experience';
import Projects from '@/components/sections/projects';
import StartProject from '@/components/sections/start-project';
import TechStack from '@/components/sections/tech-stack';
import { getProjects } from '@/lib/actions/project.action';
import { ProjectProps } from '@/types/project';

export default async function Home() {
  // const skills = await getSkills();
  const { projects = [] }: { projects: ProjectProps[] } = await getProjects({ sort: 'order', limit: 8 });

  return (
    <section className="w-full min-h-screen">
      <Banner />
      <AboutMe />
      <TechStack />
      <Projects projects={projects} />
      <Experience />
      <ContactMe />
      <StartProject />
    </section>
  );
}
