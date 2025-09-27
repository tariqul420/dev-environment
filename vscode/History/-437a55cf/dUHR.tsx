'use client';

import { experiences } from '@/data/experiences';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import ExperienceCard from '../root/experience-card';

export default function ExperienceSection() {
  return (
    <section className="pt-20" id="experience">
      <div className="container mx-auto">
        <AnimationContainer delay={0.2} className="flex items-center justify-center">
          <BadgeTitle title="Professional Experience" />
        </AnimationContainer>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <AnimationContainer delay={0.2 * index} key={index}>
              <ExperienceCard exp={exp} />
            </AnimationContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
