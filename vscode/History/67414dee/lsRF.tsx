import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MagicCardContainer from '../magic-card-container';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export default function ExperienceCard({ exp }) {
  return (
    <Link target="_blank" href={exp.link}>
      <MagicCardContainer className="transition hover:shadow-md">
        <Card className="bg-transparent">
          <CardContent className="px-6">
            <div className="relative flex flex-col md:flex-row md:items-start gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-muted">
                <Image src={exp.companyLogo} alt={`${exp.company} logo`} fill className="object-contain p-2" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col max-sm:space-y-3 md:flex-row items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                    <span className="font-medium">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mb-4 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.location}</span>
                </div>

                {/* Description */}
                <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
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
          </CardContent>
        </Card>
      </MagicCardContainer>
    </Link>
  );
}
