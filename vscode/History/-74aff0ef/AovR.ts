'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';
import logger from '../logger';

// Define the form schema
const ContactSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export async function sendContactEmail(data: ContactFormData) {
  const validEmail = data.email && isValidEmail(data.email) ? data.email : null;

  try {
    // Validate the data
    const validatedData = ContactSchema.parse(data);

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      host: 'mail.tariqul.dev',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email content
    const mailOptions = {
      from: validEmail || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: validatedData.subject,
      text: `
        Name: ${validatedData.fullName}
        Email: ${validatedData.email || 'Not provided'}
        Subject: ${validatedData.subject}
        Message: ${validatedData.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${validatedData.fullName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${validatedData.email}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${validatedData.subject}</p>
            <div style="margin: 10px 0;">
              <strong>Message:</strong>
              <p style="white-space: pre-wrap; margin-top: 5px;">${validatedData.message}</p>
            </div>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
    };

    // Send email
    // await transporter.sendMail(mailOptions);
    await Promise.all([transporter.sendMail(mailOptions)]);

    return {
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
    };
  } catch (error) {
    logger.error({ error }, 'Error sending email');

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid form data. Please check your inputs.',
      };
    }

    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
    };
  }
}
