/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

type ProductRecord = BaseRecord & {
  title: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  price: number;
  compareAtPrice: number;
  stock: number;
  _count: {
    images: number;
  };
  categoryIds: [
    {
      name: string;
    },
  ];
  salePrice: number;
  updatedAt: string;
  slug: string;
};

type CategoryRecord = BaseRecord & {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
    children: number;
  };
};
