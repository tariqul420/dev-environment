'use client';

import { experiences } from '@/data/experiences';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeTitle } from '../badge-title';
import AnimationContainer from '../global/animation-container';
import MagicCardContainer from '../magic-card-container';
import { Badge } from '../ui/badge';

export default function Experience() {
  return (
    <section className="pt-20" id="experience">
      <div className="container mx-auto">
        <AnimationContainer delay={0.2} className="flex items-center justify-center">
          <BadgeTitle title="Professional Experience" />
        </AnimationContainer>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <AnimationContainer delay={0.2 * index} key={index}>
              <Link target="_blank" href={exp.link}>
                <MagicCardContainer className="p-6">
                  <div className="relative bgca flex flex-col md:flex-row md:items-start gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-muted">
                      <Image src={exp.companyLogo} alt={`${exp.company} logo`} fill className="object-contain p-2" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col max-sm:space-y-3 md:flex-row items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                          <span className="font-medium ">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm ">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1  mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>

                      {/* Description */}
                      <ul className="list-disc list-inside space-y-2 mb-6">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="font-medium">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </MagicCardContainer>
              </Link>
            </AnimationContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
