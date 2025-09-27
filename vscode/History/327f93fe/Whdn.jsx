import AboutSection from '../components/AbourSection/AboutSection';
import { HomeSection } from '../components/HomeSection/HomeSection';
import { SkillsSection } from '../components/SkillSection/SkillSection';
import SnowflakeCursor from '../components/cursor/SnowfallCursor';
import ParticlesBackground from '../components/particels/ParticlesBg';

import ContactPage from '../components/ContactSection/ContactSection';
import Education from '../components/Education/Education';
import ProjectsPage from './(root)/projects/page';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <SnowflakeCursor></SnowflakeCursor>
        <ParticlesBackground></ParticlesBackground>
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
