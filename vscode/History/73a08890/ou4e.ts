export interface IProject {
  title: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  liveUrl: string;
  github?: string;
  technologies: string[];
  features?: string[];
  keyHighlights?: string[];
  launchDate: Date;
  category: string;
  tags?: string[];
  impact?: string;
  futurePlans?: string[];
  slug?: string;
  screenshots?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  order?: number;
}

interface ProjectCardProps {
  title: string;
  coverImage: string;
  shortDescription: string;
  slug: string;
}
