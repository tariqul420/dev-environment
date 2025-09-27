import SnowflakeCursor from '../../components/cursor/SnowfallCursor';
import ParticlesBackground from '../../components/globals/particles-background';
import AboutSection from '../../components/root/about-section';
import { HomeSection } from '../../components/root/hero-section';
import { SkillsSection } from '../../components/root/skill-section';

import Education from '../../components/Education/Education';
import ContactPage from '../../components/root/contact-section';
import ProjectsPage from './projects/page';

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
