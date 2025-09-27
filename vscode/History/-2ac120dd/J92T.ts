"use server";

import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
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
      from: process.env.EMAIL_USER,
      to: data.email || process.env.EMAIL_USER,
      replyTo: data.email || process.env.EMAIL_USER,
      subject: `Natural Sefa Contact Form`,
      text: `
        Name: ${data.name}
        Email: ${data.email || "Not provided"}
        Phone: ${data.phone}
        Message: ${data.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 10px;">Natural Sefa Contact Form</h2>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${data.email || "Not provided"}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <div style="margin: 10px 0;">
              <strong>Message:</strong>
              <p style="white-space: pre-wrap; margin-top: 5px; color: #424242;">${data.message}</p>
            </div>
          </div>
          <p style="color: #616161; font-size: 12px; margin-top: 20px; text-align: center;">
            Sent via Natural Sefa's Contact Form
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Thank you for contacting Natural Sefa! We'll respond soon.",
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      success: false,
      message: "Unable to send message. Please try again later.",
    };
  }
}
