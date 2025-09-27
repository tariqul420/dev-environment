'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactEmail } from '@/lib/actions/contact.action';
import logger from '@/lib/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ban, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import MagicButton from './magic-button';
import MagicCardContainer from './magic-card-container';

// Define the form schema with Zod
const FormSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type FormData = z.infer<typeof FormSchema>;

export default function ContactForm() {
  const [sending, setSending] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setSending(true);
    try {
      const result = await sendContactEmail(data);
      if (result?.success) {
        toast.success(result?.message);
        form.reset();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      logger.error({ error }, 'An unexpected error occurred.');
    } finally {
      setSending(false);
    }
  };

  return (
    <MagicCardContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center space-y-6 mx-auto w-full p-8">
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input className="w-full dark:bg-transparent border p-3 rounded-md" placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1 flex gap-1 items-center">{form.formState.errors.fullName && <Ban />}</FormMessage>
              </FormItem>
            )}
          />

          {/* Email Address Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input className="w-full dark:bg-transparent border p-3 rounded-md" type="email" placeholder="Email Address" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1 flex gap-1 items-center">{form.formState.errors.email && <Ban />}</FormMessage>
              </FormItem>
            )}
          />

          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input className="w-full dark:bg-transparent border p-3 rounded-md" placeholder="Subject" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1 flex gap-1 items-center">{form.formState.errors.subject && <Ban />}</FormMessage>
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Your Message</FormLabel>
                <FormControl>
                  <Textarea className="w-full resize-none dark:bg-transparent p-3 rounded-md border" rows={8} placeholder="Your Message" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1 flex gap-1 items-center">{form.formState.errors.message && <Ban />}</FormMessage>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          {!sending ? (
            <MagicButton disabled={sending} className="w-full" type="submit">
              Send Message
            </MagicButton>
          ) : (
            <Button className="w-full" disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          )}
        </form>
      </Form>
    </MagicCardContainer>
  );
}
