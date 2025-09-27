"use client";

import { InputField } from "@/components/global/form-field/input-field";
import PhoneInputField from "@/components/global/form-field/phone-input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createOrder } from "@/lib/actions/order.action";

// import { event } from "@/lib/gtag";
import { useAppSelector } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { z } from "zod";
import MyButton from "../../global/my-btn";

// Define the form schema with Zod
const FormSchema = z.object({
  fullName: z
    .string()
    .min(1, "নাম আবশ্যক")
    .min(3, "নাম কমপক্ষে ৩ ক্যারেক্টার হতে হবে")
    .max(30, "নাম ৩০ ক্যারেক্টারের বেশি হতে পারবে না"),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "অবৈধ ফোন নাম্বার ফরম্যাট")
    .min(13, "ফোন নাম্বার কমপক্ষে ১৩ ডিজিট হতে হবে")
    .max(15, "ফোন নাম্বার ১৫ ডিজিটের বেশি হতে পারবে না"),
  address: z
    .string()
    .min(1, "ঠিকানা আবশ্যক")
    .min(5, "ঠিকানা কমপক্ষে ৫ ক্যারেক্টার হতে হবে")
    .max(100, "ঠিকানা ১০০ ক্যারেক্টারের বেশি হতে পারবে না"),
  orderNote: z
    .string()
    .min(5, "অর্ডার নোট কমপক্ষে ৫ ক্যারেক্টার হতে হবে")
    .max(100, "অর্ডার নোট ১০০ ক্যারেক্টারের বেশি হতে পারবে না")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["cash-on-delivery", "bkash"]),
});

type FormData = z.infer<typeof FormSchema>;

export default function CheckoutForm({
  product,
  quantity,
}: {
  product: string;
  quantity: number;
}) {
  const [sending, setSending] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const referral = useAppSelector((state) => state.referral.value);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      orderNote: "",
      paymentMethod: "cash-on-delivery",
    },
  });

 useEffect(() => {
    if (isSignedIn && user) {
      form.setValue("fullName", user.fullName || "");
      form.setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isSignedIn, user, form]);

  // Handle form submission
// Keep this helper outside the component or above onSubmit
// async function sendPurchasePixels({
//   orderId,
//   currency,
//   totalAmount,
//   id,
//   name,
//   unitPrice,
//   qty,
// }: {
//   orderId?: string;
//   currency: string;
//   totalAmount: number;
//   id: string;
//   name: string;
//   unitPrice: number;
//   qty: number;
// }) {
//   // ---- Google Analytics (standard: 'purchase')
//   if (typeof window !== "undefined") {
//     window.gtag?.("event", "purchase", {
//       transaction_id: orderId || undefined,
//       currency,
//       value: totalAmount,
//       items: [{ item_id: id, item_name: name, price: unitPrice, quantity: qty }],
//       transport_type: "beacon",
//     });
//   }

//   // ---- Facebook Pixel (standard: 'Purchase')
//   if (typeof window !== "undefined" && typeof window.fbq === "function") {
//     window.fbq("track", "purchase", {
//       currency,
//       value: totalAmount,
//       content_name: name,
//       content_type: "product",
//       content_ids: [id],
//       contents: [{ id, quantity: qty, item_price: unitPrice }],
//       num_items: qty,
//       order_id: orderId || undefined,
//     } as unknown);
//   }

//   // ---- TikTok Pixel (recommended: 'CompletePayment')
//   if (typeof window !== "undefined" && window.ttq?.track) {
//     window.ttq.track("CompletePayment", {
//       currency,
//       value: totalAmount,
//       content_name: name,
//       content_type: "product",
//       content_id: id,
//       content_ids: [id],
//       contents: [{ id, quantity: qty, price: unitPrice }],
//       quantity: qty,
//       order_id: orderId || undefined,
//     });
//   }

//   // ---- Flush: GA callback (best-effort)
//   const waits: Promise<void>[] = [];
//   if (typeof window !== "undefined" && typeof window.gtag === "function") {
//     waits.push(
//       new Promise<void>((resolve) => {
//         window.gtag!("event", "purchase_flush_marker", {
//           transport_type: "beacon",
//           event_callback: () => resolve(),
//         });
//         setTimeout(resolve, 250); // fallback
//       }),
//     );
//   }

//   // Small grace period to let pixels fire
//   waits.push(new Promise<void>((r) => setTimeout(r, 200)));

//   await Promise.race([Promise.all(waits), new Promise<void>((r) => setTimeout(r, 400))]);
// }

// ---- Your submit handler (formatted & fixed) ----
const onSubmit: SubmitHandler<FormData> = async (data) => {
  setSending(true);

  try {
    const orderData = {
      product,
      quantity,
      name: data.fullName,
      phone: data.phone.startsWith("88") ? data.phone.slice(2) : data.phone,
      address: data.address,
      ...(data.email?.trim() && { email: data.email.trim() }),
      ...(data.orderNote?.trim() && { orderNote: data.orderNote.trim() }),
      referral,
    };

    // Wrap the whole flow (create order + pixels) in a single promise
    const promise = (async () => {
      const response = await createOrder(orderData);

      // Safe values
      // const qty = Number.isFinite(Number(quantity)) ? Number(quantity) : 1;
      // const unitPrice = Number(response?.salePrice ?? 0);
      // const totalAmount = Number((unitPrice * qty).toFixed(2));
      // const id = String(response?._id ?? product);
      // const name = String(response?.title ?? "Product");
      // const currency = "BDT";
      const orderId = String(response.orderId || "").replace("#", "");

      // Fire pixels before resolving (so success callback can stay sync)
      // await sendPurchasePixels({
      //   orderId,
      //   currency,
      //   totalAmount,
      //   id,
      //   name,
      //   unitPrice,
      //   qty,
      // });

      return { response, orderId };
    })();

    await toast.promise(promise, {
      loading: "Creating order...",
      // Keep callbacks synchronous to avoid TS1308
      success: ({ response, orderId }) => {
        router.push(`/receipt/${response.phone}-${orderId}`);
        form.reset();
        return "Order Created Successful.";
      },
      error: (error: unknown) =>
        (error as { message?: string })?.message || "Failed to create order. Please try again.",
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
        {/* Full Name Field */}
        <InputField
          name="fullName"
          label="আপনার নাম লিখুন *"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          className="w-full"
        />

        {/* Phone Number Field */}
        <PhoneInputField
          name="phone"
          label="আপনার মোবাইল নাম্বারটি লিখুন *"
          className="w-full"
        />

        {/* Email Field */}
        <InputField
          type="email"
          name="email"
          label={`ইমেইল ঠিকানা ${!isSignedIn ? "(ঐচ্ছিক)" : ""}`}
          placeholder="আপনার ইমেইল ঠিকানা লিখুন"
          disable={isSignedIn}
          className="w-full"
        />

        {/* Address Field */}
        <InputField
          name="address"
          label="আপনার ঠিকানা লিখুন *"
          placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
          className="w-full"
        />

        {/* Order Notes Field */}
        <TextareaField
          name="orderNote"
          label="অর্ডার নোট (ঐচ্ছিক)"
          placeholder="অর্ডার সম্পর্কিত বিশেষ নির্দেশনা বা নোট"
          className="w-full"
        />

        {/* Submit Button */}
        {!sending ? (
          <MyButton disabled={sending} className="w-full" type="submit">
            অর্ডার করুন
          </MyButton>
        ) : (
          <Button className="w-full" disabled>
            <Loader2 className="animate-spin" />
            অনুগ্রহ করে অপেক্ষা করুন
          </Button>
        )}
      </form>
    </Form>
  );
}
