import { BaseRecord } from "@/components/dashboard/data-table";

export interface ProductRecord extends BaseRecord {
  title: string;
  categoryIds: [
    {
      name: string;
    },
  ];
  salePrice: number;
  updatedAt: string;
  slug: string;
}

export interface BlogRecord extends BaseRecord {
  title: string;
  updatedAt: string;
  createdAt: string;
  slug: string;
  description: string;
}

export interface ReviewRecord extends BaseRecord {
  updatedAt: string;
  createdAt: string;
  rating: string;
  review: string;
}

export interface UserRecord extends BaseRecord {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  role: string;
  totalOrderCount: number;
  completedOrderCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord extends BaseRecord {
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface OrderRecord extends BaseRecord {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  orderNote: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  quantity: number;
  product?: {
    title: string;
    salePrice: number;
    packageDuration?: string;
  };
  admin?: {
    firstName: string;
    lastName: string;
  };
  referral: string;
}

export interface OrderRecordForCustomer extends BaseRecord {
  orderId: string;
  name: string;
  phone: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  quantity: number;
  product?: {
    title: string;
    salePrice: number;
    packageDuration?: string;
  };
}
