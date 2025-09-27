import ParticlesBackground from '@/components/globals/particles-background';
import SnowflakeCursor from '@/components/globals/snowfall-cursor';
import AboutSection from '@/components/root/sections/about-section';
import ContactSection from '@/components/root/sections/contact-section';
import EducationSection from '@/components/root/sections/education-section';
import ExperienceSection from '@/components/root/sections/experience-section';
import { HeroSection } from '@/components/root/sections/hero-section';
import { SkillsSection } from '@/components/root/sections/skill-section';
import ProjectsPage from './projects/page';

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
        <ExperienceSection />
        <EducationSection />
        <ProjectsPage></ProjectsPage>
        <ContactSection />
      </section>
    </>
  );
}
