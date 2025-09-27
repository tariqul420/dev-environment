'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { sendContactEmail } from '@/lib/actions/contact.action';
import logger from '@/lib/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { InputField } from './global/form-field/input-field';
import SelectField from './global/form-field/select-field';
import TextareaField from './global/form-field/textarea-field';
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
      logger.error({ error }, 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <MagicCardContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center space-y-6 mx-auto w-full p-8">
          {/* Full Name Field */}
          <InputField name="fullName" label="Full Name" placeholder="Full Name" className="w-full" />

          {/* Email Address Field */}
          <InputField type="email" name="email" label="Email Address" placeholder="Email Address" className="w-full" />

          {/* Subject Field */}
          <SelectField
            name="subject"
            label="Subject"
            placeholder="Select a subject"
            className="w-full"
            options={[
              { label: 'Project Inquiry', value: 'project_inquiry' },
              { label: 'Collaboration Opportunity', value: 'collaboration' },
              { label: 'Job Offer', value: 'job_offer' },
              { label: 'Freelance Work', value: 'freelance' },
              { label: 'Technical Support', value: 'support' },
              { label: 'General Question', value: 'general' },
              { label: 'Other', value: 'other' },
            ]}
          />

          {/* Message Field */}
          <TextareaField className="w-full" name="message" label="Your Message" placeholder="Your Message" />

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
