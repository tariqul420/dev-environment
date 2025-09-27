import { IOrder } from "@/types/order";
import mongoose from "mongoose";
import "./user.model";

const orderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required."],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
    },
    orderNote: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash-on-delivery", "bkash"],
      default: "cash-on-delivery",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    referral: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Add indexes
orderSchema.index({ orderId: 1 }, { unique: true }); // For order ID lookups
orderSchema.index({ email: 1 }); // For customer order lookups
orderSchema.index({ status: 1 }); // For status filtering
orderSchema.index({ createdAt: -1 }); // For sorting by date
orderSchema.index({ product: 1 }); // For product lookups
orderSchema.index({ phone: 1 }); // For phone number lookups

// Generate orderId before validation
orderSchema.pre("validate", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });
    let newOrderNumber = 1;

    if (lastOrder && lastOrder.orderId) {
      const lastNumber = parseInt(lastOrder.orderId.replace("#", ""));
      newOrderNumber = lastNumber + 1;
    }

    this.orderId = `#${String(newOrderNumber).padStart(5, "0")}`;
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

const Order =
  mongoose.models?.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
