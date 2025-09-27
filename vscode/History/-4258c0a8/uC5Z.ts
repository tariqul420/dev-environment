import { z } from "zod";

export const PaymentMethodEnum = z.enum([
  "COD",
  "BKASH",
  "NAGAD",
  "CARD",
  "BANK",
]);
export const OrderSourceEnum = z.enum(["DIRECT", "CART"]);

export const OrderItemInputSchema = z.object({
  productId: z.string().min(1, "Missing product id."),
  quantity: z.coerce.number().int().positive("Quantity must be > 0"),
});

export const BdPhoneSchema = z
  .string()
  .trim()
  .min(7, "অবৈধ ফোন")
  .max(20, "অবৈধ ফোন")
  .refine((s) => /^[0-9+\-\s()]+$/.test(s), {
    message: "অবৈধ ফোন নাম্বার ফরম্যাট",
  })
  .transform((s) => s.replace(/[^\d+]/g, ""))
  .transform((s) => {
    if (s.startsWith("+880")) return `0${s.slice(4)}`;
    if (s.startsWith("880")) return `0${s.slice(3)}`;
    return s;
  })
  .refine((s) => /^01[3-9]\d{8}$/.test(s), {
    message: "সঠিক বাংলাদেশি মোবাইল দিন (যেমন 017XXXXXXXX)",
  });

export const OrderCustomerSchema = z.object({
  customerName: z.string().min(3, "নাম কমপক্ষে ৩ ক্যারেক্টার হতে হবে").max(30),
  customerPhone: z.string().min(7, "অবৈধ ফোন").max(20, "অবৈধ ফোন"),
  shippingAddress: z.string().min(5, "ঠিকানা খুব ছোট").max(100, "ঠিকানা খুব বড়"),
  orderNote: z.string().min(5).max(100).optional().or(z.literal("")),
});

const BaseOrderPayloadSchema = z.object({
  paymentMethod: PaymentMethodEnum,
  referral: z.string().optional(),
  customer: OrderCustomerSchema,
});

export const DirectOrderPayloadSchema = BaseOrderPayloadSchema.extend({
  mode: z.literal("direct"),
  items: z
    .array(OrderItemInputSchema)
    .length(1, "Direct order must have exactly 1 item."),
});

export const CartOrderPayloadSchema = BaseOrderPayloadSchema.extend({
  mode: z.literal("cart"),
  items: z
    .array(OrderItemInputSchema)
    .min(1, "Cart order must include at least 1 item."),
});

export const OrderCreateSchema = z.discriminatedUnion("mode", [
  DirectOrderPayloadSchema,
  CartOrderPayloadSchema,
]);

export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;
export type OrderCustomerInput = z.infer<typeof OrderCustomerSchema>;
export type DirectOrderPayload = z.infer<typeof DirectOrderPayloadSchema>;
export type CartOrderPayload = z.infer<typeof CartOrderPayloadSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type BdPhone = z.infer<typeof BdPhoneSchema>;
