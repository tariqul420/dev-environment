import ParticlesBackground from '../../components/globals/particles-background';
import SnowflakeCursor from '../../components/globals/snowfall-cursor';
import AboutSection from '../../components/root/about-section';
import ContactPage from '../../components/root/contact-section';
import EducationSection from '../../components/root/education-section';
import { HeroSection } from '../../components/root/hero-section';
import { SkillsSection } from '../../components/root/skill-section';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <SnowflakeCursor />
        <ParticlesBackground />
      </div>
      <section className="max-w-7xl mx-auto relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsPage></ProjectsPage>
        <ContactPage />
      </section>
    </>
  );
}
