"use server";

import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export async function sendContactEmail(data: ContactFormData) {
  const validEmail = data.email && isValidEmail(data.email) ? data.email : null;

  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      host: "mail.naturalsefa.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email content
    const mailOptions = {
      from: validEmail || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Natural Sefa - Contact Form`,
      text: `
        Name: ${data.name}
        Email: ${validEmail || "Not provided"}
        Phone: ${data.phone}
        Message: ${data.message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Thank you for contacting Natural Sefa! We'll respond soon.",
    };
  } catch (error) {
    console.error(error);

    throw new Error("Unable to send message. Please try again later.");
  }
}
