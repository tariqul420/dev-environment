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
  category?: string;
  tags?: string[];
  impact?: string; // Narrative outcome or benefit
  futurePlans?: string[];
  slug?: string; // Auto-generated if not provided
  screenshots?: string[]; // Additional images
  isFeatured?: boolean; // ✅ For homepage highlighting
  order?: number; // ✅ For custom sorting
}
