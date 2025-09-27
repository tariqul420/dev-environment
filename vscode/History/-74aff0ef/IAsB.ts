'use server';

import nodemailer from 'nodemailer';
import { z } from 'zod';
import logger from '../logger';

// ===== Schema =====
const ContactSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});
type ContactFormData = z.infer<typeof ContactSchema>;

// ===== Theme =====
const THEME = {
  purple: '#9e7aff',
  pink: '#fe8bbb',
  white: '#ffffff',
  darkDeep: '#000000',
  darkLite: '#111111',
};

// ===== Utils =====
function isValidEmail(email: string): boolean {
  // looser than zod to guard replyTo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailRegex.test(email);
}

const escapeHTML = (s = '') => s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));

const toText = (p: { name: string; email: string; subject: string; message: string }) => {
  return `New Contact Form Submission

Name: ${p.name}
Email: ${p.email || 'Not provided'}
Subject: ${p.subject}

Message:
${p.message}

— Sent from your portfolio contact form.`;
};

const toHTML = (p: {
  name: string;
  email: string;
  subject: string;
  messageHTML: string; // already escaped + <br>
  preheader?: string;
  forSender?: boolean;
}) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="x-apple-disable-message-reformatting">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.forSender ? 'Thanks for your message' : 'New Contact Form Submission'}</title>
<style>
@media (max-width: 600px) {
  .container { width: 100% !important; border-radius: 0 !important; }
  .p-24 { padding: 16px !important; }
  .h1 { font-size: 22px !important; }
}
@media (prefers-color-scheme: dark) {
  .bg { background: ${THEME.darkDeep} !important; }
  .card { background: ${THEME.darkLite} !important; }
  .text { color: ${THEME.white} !important; }
  .muted { color: #94a3b8 !important; }
  .divider { border-color: #222 !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:${THEME.darkDeep};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg" style="background:${THEME.darkDeep};">
  <tr>
    <td align="center" style="padding:24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:100%; background:${
        THEME.darkLite
      }; border-radius:14px; overflow:hidden;">
        <!-- Hidden preview text -->
        <tr>
          <td style="display:none;opacity:0;visibility:hidden;mso-hide:all;height:0;width:0;max-height:0;max-width:0;overflow:hidden;">
            ${p.preheader || 'New message from your portfolio'}
          </td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, ${THEME.purple}, ${THEME.pink}); padding: 24px;">
            <table role="presentation" width="100%">
              <tr>
                <td align="left">
                  <div style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white};">
                    <div style="font-size:12px; letter-spacing:.12em; text-transform:uppercase; opacity:.9;">
                      ${p.forSender ? 'Confirmation' : 'Portfolio Contact'}
                    </div>
                    <div class="h1" style="font-size:24px; font-weight:800; margin-top:6px;">
                      ${p.forSender ? 'Thanks for reaching out!' : 'New Submission'}
                    </div>
                  </div>
                </td>
                <td align="right" style="white-space:nowrap;">
                  <span style="display:inline-block; padding:6px 10px; border:1px solid rgba(255,255,255,.4); border-radius:999px; font-family:Arial,Helvetica,sans-serif; color:${
                    THEME.white
                  }; font-size:12px;">
                    ${new Date().toLocaleString()}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td class="p-24" style="padding:24px;">
            <table role="presentation" width="100%">
              <tr>
                <td class="text" style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white}; font-size:16px; line-height:1.6;">
                  <p style="margin:0 0 12px 0;">
                    ${p.forSender ? 'I received your message and will get back to you shortly. Here’s a copy for your records:' : 'You’ve received a new message from your portfolio contact form.'}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 10px;">
                    <tr>
                      <td width="140" class="muted" style="font-family:Arial,Helvetica,sans-serif; color:#a1a1aa; font-size:13px;">Name</td>
                      <td class="text" style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white}; font-size:15px; font-weight:600;">${p.name}</td>
                    </tr>
                    <tr>
                      <td width="140" class="muted" style="font-family:Arial,Helvetica,sans-serif; color:#a1a1aa; font-size:13px;">Email</td>
                      <td class="text" style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white}; font-size:15px; font-weight:600;">${p.email}</td>
                    </tr>
                    <tr>
                      <td width="140" class="muted" style="font-family:Arial,Helvetica,sans-serif; color:#a1a1aa; font-size:13px;">Subject</td>
                      <td class="text" style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white}; font-size:15px; font-weight:600;">${p.subject}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td class="divider" style="border-top:1px solid #1f2937; height:1px; line-height:1px; font-size:0;">&nbsp;</td>
              </tr>

              <tr>
                <td style="padding-top:18px;">
                  <div class="text" style="font-family:Arial,Helvetica,sans-serif; color:${THEME.white};">
                    <div style="font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:#a1a1aa; margin-bottom:8px;">Message</div>
                    <div style="font-size:15px; line-height:1.8; background:#0b0b0b; border:1px solid #1f2937; padding:16px; border-radius:10px;">
                      ${p.messageHTML}
                    </div>
                  </div>
                </td>
              </tr>

              ${
                p.forSender
                  ? `
              <tr>
                <td style="padding-top:20px;">
                  <p class="muted" style="font-family:Arial,Helvetica,sans-serif; color:#94a3b8; font-size:12px; line-height:1.6; margin:0;">
                    If you didn’t submit this message, you can ignore this email.
                  </p>
                </td>
              </tr>`
                  : ''
              }

              <tr>
                <td style="padding-top:28px;">
                  <p class="muted" style="font-family:Arial,Helvetica,sans-serif; color:#94a3b8; font-size:12px; line-height:1.6; margin:0;">
                    This email was sent from your portfolio contact form.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

// ===== Main action =====
export async function sendContactEmail(data: ContactFormData) {
  try {
    const validatedData = ContactSchema.parse(data);

    const safe = {
      name: escapeHTML(validatedData.fullName),
      email: escapeHTML(validatedData.email || 'Not provided'),
      subject: escapeHTML(validatedData.subject),
      messageHTML: escapeHTML(validatedData.message).replace(/\n/g, '<br>'),
    };

    const replyTo = isValidEmail(validatedData.email) ? validatedData.email : undefined;

    // Transporter (uses your custom SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // tls: { rejectUnauthorized: false },
    });

    // --- Admin mail (to you)
    const adminMail = {
      from: process.env.FROM_EMAIL,
      replyTo,
      to: process.env.FROM_EMAIL,
      subject: `[Portfolio] ${validatedData.subject}`,
      text: toText({
        name: validatedData.fullName,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }),
      html: toHTML({
        name: safe.name,
        email: safe.email,
        subject: safe.subject,
        messageHTML: safe.messageHTML,
        preheader: `New message from ${safe.name} · ${safe.subject}`,
      }),
    };

    // --- Sender copy (to the visitor)
    const senderCopy = replyTo
      ? {
          from: process.env.FROM_EMAIL!,
          to: replyTo,
          subject: `We received your message: ${validatedData.subject}`,
          text:
            `Hi ${validatedData.fullName},\n\n` +
            `Thanks for reaching out! I received your message and will get back to you soon.\n\n` +
            toText({
              name: validatedData.fullName,
              email: validatedData.email,
              subject: validatedData.subject,
              message: validatedData.message,
            }),
          html: toHTML({
            name: safe.name,
            email: safe.email,
            subject: safe.subject,
            messageHTML: safe.messageHTML,
            preheader: 'Thanks for your message — here’s a copy for your records.',
            forSender: true,
          }),
        }
      : null;

    await Promise.all([transporter.sendMail(adminMail), senderCopy ? transporter.sendMail(senderCopy) : Promise.resolve()]);

    return { success: true, message: 'Message sent successfully! I will get back to you soon.' };
  } catch (error) {
    logger.error({ error }, 'Error sending email');
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid form data. Please check your inputs.' };
    }
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}
