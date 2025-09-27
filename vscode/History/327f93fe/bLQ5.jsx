import ParticlesBackground from '../../components/globals/particles-background';
import SnowflakeCursor from '../../components/globals/snowfall-cursor';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <SnowflakeCursor />
        <ParticlesBackground />
      </div>
      <section className="max-w-7xl mx-auto relative">
        <HomeSection></HomeSection>
        <AboutSection></AboutSection>
        <SkillsSection></SkillsSection>
        <Education></Education>
        <ProjectsPage></ProjectsPage>
        <ContactPage></ContactPage>
      </section>
    </>
  );
}
