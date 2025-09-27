"use client";

import MyButton from "@/components/global/my-btn";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactEmail } from "@/lib/actions/contact.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import * as z from "zod";

// Zod schema for form validation (in Bengali for error messages)
const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" })
    .max(50, { message: "নাম ৫০ অক্ষরের বেশি হতে পারবে না" }).,
  email: z.string().email({ message: "অবৈধ ইমেইল ঠিকানা" }),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "অবৈধ ফোন নাম্বার ফরম্যাট")
    .min(13, "ফোন নাম্বার কমপক্ষে ১৩ ডিজিট হতে হবে")
    .max(15, "ফোন নাম্বার ১৫ ডিজিটের বেশি হতে পারবে না"),
  message: z
    .string()
    .min(10, { message: "বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে" })
    .max(500, { message: "বার্তা ৫০০ অক্ষরের বেশি হতে পারবে না" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [sending, setSending] = useState(false);

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setSending(true);

    toast.promise(sendContactEmail(data), {
      loading: "Sending your message...",
      success: (response) => {
        form.reset();
        setSending(false);
        return response.message || "Message sent successfully!";
      },
      error: () => {
        setSending(false);
        return "Failed to send message. Please try again.";
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-6 shadow-md"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-gray-100">
                নাম
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="আপনার নাম লিখুন"
                  {...field}
                  className="text-gray-600 dark:text-gray-300"
                />
              </FormControl>
              <FormMessage className="mt-1 flex items-center gap-1 text-sm text-red-500">
                {form.formState.errors.name && <Ban />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-gray-100">
                ইমেইল
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="আপনার ইমেইল লিখুন"
                  {...field}
                  className="text-gray-600 dark:text-gray-300"
                />
              </FormControl>
              <FormMessage className="mt-1 flex items-center gap-1 text-sm text-red-500">
                {form.formState.errors.email && <Ban />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>আপনার মোবাইল নাম্বারটি লিখুন *</FormLabel>
              <FormControl>
                <PhoneInput
                  country={"bd"}
                  onlyCountries={["bd"]}
                  value={field.value}
                  onChange={field.onChange}
                  inputClass="w-full rounded-md border p-3"
                  containerClass="w-full"
                  inputStyle={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "inherit",
                  }}
                  buttonStyle={{
                    backgroundColor: "transparent",
                    color: "inherit",
                  }}
                  countryCodeEditable={false}
                  enableSearch={false}
                  disableSearchIcon={true}
                  disableDropdown={true}
                />
              </FormControl>
              <FormMessage className="mt-1 flex items-center gap-1 text-sm text-red-500">
                {form.formState.errors.phone && <Ban />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-gray-100">
                বার্তা
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="আপনার বার্তা লিখুন"
                  {...field}
                  className="text-gray-600 dark:text-gray-300"
                />
              </FormControl>
              <FormMessage className="mt-1 flex items-center gap-1 text-sm text-red-500">
                {form.formState.errors.message && <Ban />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        {!sending ? (
          <MyButton disabled={sending} className="w-full" type="submit">
            বার্তা পাঠান
          </MyButton>
        ) : (
          <Button className="w-full" disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        )}
      </form>
    </Form>
  );
}
