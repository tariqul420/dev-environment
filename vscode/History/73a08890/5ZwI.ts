export interface IProject {
  order?: number;
  name: string;
  description: string;
  image: string[];
  category: string;
  projectCategory: string;
  launchDate: Date;
  author: string;
  projectType: string[];
  platforms: string[];
  technologies: string[];
  challenges: string[];
  futurePlans: string[];
  live: string;
  github?: string;
  details: string;
  features: string[];
  achievements: string[];
  keyHighlights: string[];
  developmentTime: string;
  teamSize: number;
  impact: string;
  slug: string;
}

export interface ProjectsParams {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProjectProps {
  slug: string;
  image: string[];
  name: string;
  description: string;
}
