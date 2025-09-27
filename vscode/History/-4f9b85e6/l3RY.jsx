"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendContactEmail } from "@/lib/actions/contact.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { InputField } from "../globals/form-field/input-field";
import TextareaField from "../globals/form-field/textarea-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Zod schema for validation
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must not exceed 100 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

export default function ContactForm() {
  const [sending, setSending] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setSending(true);

    await toast.promise(sendContactEmail(data), {
      loading: "Sending your message...",
      success: (res) => {
        form.reset();
        setSending(false);
        return res?.message || "Message sent successfully! 🎉";
      },
      error: (err) => {
        setSending(false);
        return err?.message || "Failed to send message. Please try again.";
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-6 shadow-md h-fit"
      >
        {/* Name */}
        <InputField name="name" label="Name" placeholder="Enter your name" />

        {/* Email */}
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
        />

        {/* Subject (Select bound to RHF) */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="subject" className="mt-2">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className={'min-w-full'}>
                    <SelectItem value="web-development">
                      Web Development Project
                    </SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="collaboration">Collaboration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <TextareaField
          name="message"
          label="Message"
          placeholder="Write your message here..."
        />

        {/* Submit */}
        {!sending ? (
          <Button disabled={sending} className="w-full" type="submit">
            Send Message
          </Button>
        ) : (
          <Button className="w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </Button>
        )}
      </form>
    </Form>
  );
}
