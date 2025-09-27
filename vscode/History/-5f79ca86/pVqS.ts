/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

type ProductRecord = BaseRecord & {
  title: string;
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
};
