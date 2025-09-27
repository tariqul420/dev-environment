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
  category?: string; // e.g. "Web App", "Data Science"
  tags?: string[];
  impact?: string; // optional narrative impact result
  futurePlans?: string[];
  slug?: string;
  screenshots?: string[]; // extra images
  testimonial?: {
    quote: string;
    author?: string;
    role?: string;
  };
}
