export const revalidate = 86400;
export const fetchCache = "force-cache";

import ContactForm from "@/components/root/contact-us/contact-form";
import { IconDock } from "@/components/root/contact-us/icon-dock";
import { Mail, MapPin, PhoneCall } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-8 text-center">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">
            ন্যাচারাল সেফার সাথে যোগাযোগ করুন
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            আপনার যেকোনো প্রশ্ন বা উদ্বেগের জন্য ন্যাচারাল সেফার সাথে যোগাযোগ
            করুন। আমরা আপনাকে সাহায্য করতে এখানে আছি!
          </p>
        </div>
      </section>
      {/* Contact Form and Information Section */}
      <section className="pt-16">
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
          {/* Contact Information Card */}

          <div className="flex h-full flex-col justify-between rounded-xl p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div>
              <h3 className="mb-4 text-xl font-semibold sm:text-2xl">
                যোগাযোগ করুন
              </h3>
              <p className="mb-6 text-sm sm:text-base">
                আমরা আপনার স্বাস্থ্য সম্পর্কিত প্রশ্ন বা পণ্য সম্পর্কিত তথ্যের
                জন্য উৎসাহিত। ইমেইল, ফোন, বা ফর্মের মাধ্যমে যোগাযোগ করুন, আমরা
                দ্রুত উত্তর দেব!
              </p>
            </div>

            {/* Contact Info List */}
            <ul className="space-y-4">
              <li className="group flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors sm:text-base lg:text-lg">
                <PhoneCall className="h-5 w-5" />
                <span className="break-words">+8809647-001177</span>
              </li>
              <li className="group flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors sm:text-base lg:text-lg">
                <Mail className="h-5 w-5" />
                <span className="break-words">support@naturalsefa.com</span>
              </li>
              <li className="group flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors sm:text-base lg:text-lg">
                <MapPin className="h-5 w-5" />
                <span className="break-words">পাবনা, বাংলাদেশ</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-4 flex items-center justify-center">
              <IconDock />
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-semibold text-gray-800 dark:text-gray-100">
            ন্যাচারাল সেফার অবস্থান
          </h2>
          <div className="h-[400px] w-full overflow-hidden rounded-lg shadow-md">
            {/* Google Maps iframe */}
            <iframe
              title="Natural Sefa Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1818.9970088785562!2d89.31658730869762!3d24.241987997571904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc2f00508e271d%3A0xf18fb6f3d30a73fe!2sNatural%20Sefa!5e0!3m2!1sen!2sbd!4v1752483884903!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              className="h-full w-full contrast-125 grayscale dark:brightness-75"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
