export interface IProject {
  order?: number;
  title: string;
  description: string;
  images: string[];
  category: mongoose.Schema.Types.ObjectId | string;
  launchDate: Date;
  author: string;
  projectType: string;
  platforms: string[];
  technologies: string[];
  challenges: string[];
  futurePlans?: string[]; // ✅ Optional
  liveUrl: string;
  github?: string; // ✅ Optional
  details: string;
  features: string[];
  achievements: string[];
  keyHighlights: string[];
  developmentTime: string;
  teamSize: number;
  impact: string;
  slug?: string;
}
