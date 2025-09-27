"use client";
import { FacebookIcon, YoutubeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../global/logo";
import { WhatsappIcon } from "../icons/whatsapp";
import { Separator } from "../ui/separator";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact" },
];

const resources = [
  { name: "Terms and Conditions", href: "/terms-and-conditions" },
  { name: "FAQs", href: "/faqs" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  {
    name: "Returns and Refunds Policy",
    href: "/returns-and-refunds-policy",
  },
];

const Footer = () => {
  return (
    <footer className="py-12 px-4 font-english border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Logo />
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Innovating for a better tomorrow. We are committed to delivering
            high-quality solutions that empower businesses and individuals.
          </p>
          <div className="flex space-x-5 pt-2">
            <Link
              target="_blank"
              href="https://www.facebook.com/naturalsefabd"
              className="text-primary transition-transform transform hover:scale-110"
            >
              <FacebookIcon size={28} />
            </Link>
            <Link
              target="_blank"
              href="https://www.youtube.com/channel/UCZDOWSPodbqYsi4WIlUwc1g"
              className="text-primary transition-transform transform hover:scale-110"
            >
              <YoutubeIcon size={28} />
            </Link>
            <Link
              target="_blank"
              href="https://chat.whatsapp.com/G62FiyRWJnN8zSvNhfmMhY"
              className="text-primary transition-transform transform hover:scale-110"
            >
              <WhatsappIcon size={40} />
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Resources
          </h3>
          <ul className="space-y-3">
            {resources.map((resource) => (
              <li key={resource.name}>
                <Link
                  href={resource.href}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {resource.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Contact Us
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Notun Bazar, Chatmohar Pabna
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Email: support@naturalsefa.com
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Phone: 09647-001177
          </p>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="text-center text-muted-foreground text-sm ">
        <p>
          &copy; {new Date().getFullYear()} Natural Sefa. All rights reserved.
        </p>
        <p className="mt-1">
          Developed by{" "}
          <Link
            className="hover:text-primary transition-all duration-300"
            target="_blank"
            href="https://www.tariqul.dev"
          >
            Tariqul Islam
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
