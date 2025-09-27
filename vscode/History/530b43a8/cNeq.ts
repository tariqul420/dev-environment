export interface Category {
  _id: string;
  name: string;
}

export interface IProduct {
  title: string;
  titleBengali: string;
  shortDesc: string;
  imageUrls: string[];
  slug?: string;
  regularPrice: number;
  salePrice: number;
  detailedDesc: string;
  tag?: string;
  packageDuration?: string;
  weight: string;
  categoryIds: Array<string | Category>;
}

export interface ProductProps {
  title: string;
  titleBengali: string;
  shortDesc: string;
  regularPrice: number;
  salePrice: number;
  imageUrls: string[];
  tag?: string;
  slug: string;
  packageDuration?: string;
}

export interface ProductParams {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface GetProductsResponse {
  products: ProductProps[];
  total: number;
  hasNextPage: boolean;
}
