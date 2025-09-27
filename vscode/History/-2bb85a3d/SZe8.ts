export interface IBlog {
  title: string;
  content: string;
  description: string;
  author;
  slug?: string;
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
