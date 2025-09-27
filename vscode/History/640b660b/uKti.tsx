"use client";

import { InputField } from "@/components/global/form-field/input-field";
import PhoneInputField from "@/components/global/form-field/phone-input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createOrder } from "@/lib/actions/order.action";

import { event } from "@/lib/gtag";
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

  // Update form values when user data is available
  useEffect(() => {
    if (isSignedIn && user) {
      form.setValue("fullName", user.fullName || "");
      form.setValue("email", user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isSignedIn, user, form]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSending(true);

    const orderData = {
      product,
      quantity,
      name: data.fullName,
      phone: data.phone,
      address: data.address,
      ...(data.email?.trim() && { email: data.email.trim() }),
      ...(data.orderNote?.trim() && { orderNote: data.orderNote.trim() }),
    };

    toast.promise(createOrder(orderData), {
      loading: "Creating order...",
      success: (response) => {
        // GA event for order completion
        event({
          action: "purchase",
          category: "ecommerce",
          label: product,
          value: quantity,
        });

        const orderId = response.orderId.replace("#", "");
        router.push(`/receipt/${response.phone}-${orderId}`);
        toast.success("Order Created Successful.");
        form.reset();
        setSending(false);
        return response;
      },
      error: (error) => {
        setSending(false);
        return error?.message || "Failed to create order. Please try again.";
      },
    });
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
          name="orderNotes"
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
