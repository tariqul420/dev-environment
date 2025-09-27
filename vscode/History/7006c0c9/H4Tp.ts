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
  includeDraft?: boolean;
};

type ProductProps = {
  id: string;
  title: string;
  price: Decimal | number;
  compareAtPrice?: Decimal | number;
  packageDuration: string;
  shortDescription: string;
  images: { url: string; alt?: string | null }[];
  tag?: string;
};

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  tag?: string | null;
  packageDuration?: string | null;
  images: Array<{ url: string; alt?: string | null }>;
  max?: number;
  inStock: true | false;
};

type PublicProductType = {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  price: number | string | Decimal | null;
  compareAtPrice: number | string | Decimal | null;
  tag?: string | null;
  packageWeight?: string | null;
  packageDuration?: string | null;
  stock: number;
  images: { id: string; url: string; alt?: string | null; sort: number }[];
  categories: { id: string; name: string }[];
  categoryIds: string[];
};

type AdminProductForEditType = {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  price: number | string | Decimal | null;
  compareAtPrice: number | string | Decimal | null;
  stock: number;
  tag?: string | null;
  packageWeight?: string | null;
  packageDuration?: string | null;
  images: { id: string; url: string; alt?: string | null; sort: number }[];
  categories: { category: { id: string; name: string } }[];
  categoryIds: string[];
};