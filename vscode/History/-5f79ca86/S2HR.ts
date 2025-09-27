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
  _count: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
};

type UserRecord = BaseRecord & {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  role: string;
  totalOrderCount: number;
  completedOrderCount: number;
  createdAt: string;
  updatedAt: string;
};

