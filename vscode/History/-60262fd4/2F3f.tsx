"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import InputField from "@/components/global/form-field/input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createOrder } from "@/lib/actions/order.action";
import useCart from "@/lib/hooks/use-cart";
import { clearCart } from "@/lib/redux/features/cart/cart-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { normalizePhone } from "@/lib/utils/normalize-phone";
import {
  type OrderCreateInput,
  OrderCreateSchema,
} from "@/lib/validators/order";

const Schema = z.object({
  customerName: z.string().min(3, "নাম কমপক্ষে ৩ ক্যারেক্টার হতে হবে").max(30),
  customerPhone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "অবৈধ ফোন নাম্বার ফরম্যাট")
    .min(11, "ফোন নাম্বার কমপক্ষে ১১ ডিজিট হতে হবে")
    .max(14, "ফোন নাম্বার ১৪ ডিজিটের বেশি হতে পারবে না"),
  shippingAddress: z.string().min(5).max(100),
  orderNote: z.string().min(5).max(100).optional().or(z.literal("")),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "CARD", "BANK"]),
});

type FormData = {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  orderNote?: string;
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "CARD" | "BANK";
};

export default function CheckoutForm({
  mode,
  directItem,
}: {
  mode: "direct" | "cart";
  directItem?: { id: string; qty: number };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useCart();
  const [sending, setSending] = useState(false);
  const referral = useAppSelector((state) => state?.referral.value);
  
  const form = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      shippingAddress: "",
      orderNote: "",
      paymentMethod: "COD",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setSending(true);

      const base = {
        customer: {
          customerName: data.customerName.trim(),
          customerPhone: normalizePhone(data.customerPhone),
          shippingAddress: data.shippingAddress.trim(),
          ...(data.orderNote?.trim() && { orderNote: data.orderNote.trim() }),
          ...(referral && { referral }),
        },
        paymentMethod: data.paymentMethod,
      } as const;

      const payload: OrderCreateInput =
        mode === "direct" && directItem
          ? {
              mode: "direct",
              items: [{ productId: directItem.id, quantity: directItem.qty }],
              ...base,
            }
          : {
              mode: "cart",
              items: items.map((it) => ({
                productId: it.id,
                quantity: it.qty,
              })),
              ...base,
            };

      OrderCreateSchema.parse(payload);

      await toast.promise(createOrder(payload), {
        loading: "অর্ডার তৈরি হচ্ছে...",
        success: (res) => {
          const { orderNo, phone } = res;
          if (mode === "cart") dispatch(clearCart());
          form.reset();
          router.push(`/receipt/${phone}-${orderNo}`);
          return "অর্ডার সফলভাবে তৈরি হয়েছে।";
        },
        error: (err) => err?.message || "অর্ডার তৈরি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full flex-col items-center justify-center space-y-6"
      >
        <InputField
          name="customerName"
          label="আপনার নাম লিখুন *"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          className="w-full"
        />

        <InputField
          type="tel"
          name="customerPhone"
          label="আপনার মোবাইল নাম্বারটি লিখুন *"
          placeholder="আপনার মোবাইল নাম্বারটি লিখুন"
          className="w-full"
        />

        <InputField
          name="shippingAddress"
          label="আপনার ঠিকানা লিখুন *"
          placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
          className="w-full"
        />

        <TextareaField
          name="orderNote"
          label="অর্ডার নোট (ঐচ্ছিক)"
          placeholder="অর্ডার সম্পর্কিত বিশেষ নির্দেশনা বা নোট"
          className="w-full"
        />

        {!sending ? (
          <Button
            disabled={!items || items.length === 0}
            className="w-full"
            type="submit"
          >
            অর্ডার করুন
          </Button>
        ) : (
          <Button className="w-full" disabled>
            <Loader2 className="mr-2 animate-spin" />
            অনুগ্রহ করে অপেক্ষা করুন
          </Button>
        )}
      </form>
    </Form>
  );
}
