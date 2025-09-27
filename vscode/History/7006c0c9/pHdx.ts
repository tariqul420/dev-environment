/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

// product FormItem
type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
type Category = { id: string; name: string };
type ProductImage = {
  id: string;
  url: string;
  sort: number;
  alt?: string | null;
};

type ProductForEdit = {
  id: string;
  title: string;
  description?: string | null;
  shortDescription?: string | null;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  tag?: string | null;
  packageWeight?: string | null;
  packageDuration?: string | null;
  images?: ProductImage[];
  categories?: { category: { id: string; name: string } }[];
};

type ProductParams = {
  search?: string;
  sort?: "default" | "newest" | "oldest" | "price-low" | "price-high";
  page?: number;
  limit?: number;
  category?: string;
};

type ProductProps = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  packageDuration: string;
  shortDescription: string;
  images: { url: string; alt?: string | null }[];
  tag?: string;
};