export interface IBlog {
  _id?: string;
  title: string;
  description: string;
  content: string;
  author?: {
    _id?: string;
    name?: string;
    avatar?: string;
  };
  coverImage?: string;
  categories?: string[];
  tags?: string[];
  readTime?: number;
  isPublished?: boolean;
  slug?: string;
  views?: number;
  likes?: number;
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogCardProps extends IBlog {
  createdAt: string;
}

export interface BlogParams {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
