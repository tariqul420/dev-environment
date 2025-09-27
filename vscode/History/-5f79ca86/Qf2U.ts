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

interface CategoryRecord extends BaseRecord {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
