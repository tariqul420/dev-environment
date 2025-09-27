import mongoose from "mongoose";

export interface IOrder {
  orderId?: string;
  product: mongoose.Schema.Types.ObjectId | string;
  quantity: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  orderNote?: string;
  paymentMethod?: "cash-on-delivery" | "bkash";
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  admin?: mongoose.Schema.Types.ObjectId;
  referral: string;
}

export interface FormOrderType {
  product: string;
  quantity: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  orderNote?: string;
}

export interface OrderData {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  quantity: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  product: {
    title: string;
    salePrice: number;
    packageDuration?: string;
  };
}

export interface OrdersPageWrapperProps {
  initialOrders;
  totalItems;
  pageIndex;
  pageSize;
}
