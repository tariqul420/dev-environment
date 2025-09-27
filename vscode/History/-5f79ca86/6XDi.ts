/** biome-ignore-all lint/correctness/noUnusedVariables: <> */

type AdminProductRow = BaseRecord & {
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
  id: string;
};

type AdminCategoryRow = BaseRecord & {
  id: string;
  name: string;
  _count: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
};

type AdminUserRow = BaseRecord & {
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

type AdminOrderRow = BaseRecord & {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  referral?: string | null;
  status: string;
  paymentMethod: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  total: string | number;
  items: {
    id: string;
    title: string;
    qty: number;
    unitPrice: string | number;
    total: string | number;
    productId?: string | null;
  }[];
  statusUpdatedBy?: { id: string; name?: string | null } | null;
};

type CustomerOrderRow = BaseRecord & {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  orderNote: string | null;
  status: string;
  paymentMethod: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  currency?: string | null;
  subtotal: string | number;
  shippingTotal: string | number;
  statusUpdatedAt: string | Date;
  total: string | number;
  items: {
    id: string;
    title: string;
    qty: number;
    unitPrice: string | number;
    total: string | number;
    productId?: string | null;
  }[];
};
