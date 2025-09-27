import JsonLd from "@/components/seo/json-ld";
import QRClient from "@/components/tools/url/qr-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "QR Code • Tools Hub",
  description:
    "Create QR codes from text and links in seconds. Support for Wi-Fi, vCard, Email, SMS, and WhatsApp. Customize colors, error correction, add a center logo, and export as PNG or SVG.",
  path: "/tools/url/qr",
  keywords: [
    "QR code",
    "QR generator",
    "QR code maker",
    "QR code generator",
    "create QR code online",
    "free QR code",
    "custom QR code",
    "safe QR codes",
    "URL QR code",
    "text QR code",
    "Wi-Fi QR",
    "wifi QR code",
    "vCard QR",
    "contact QR code",
    "WhatsApp QR",
    "Email QR",
    "SMS QR",
    "SVG QR",
    "PNG QR",
    "high resolution QR",
    "error correction L M Q H",
    "custom colors",
    "quiet zone",
    "center logo overlay",
    "download QR PNG",
    "download QR SVG",
    "copy data URL",
    "Tools Hub",
    "Bangladesh",
    "online tools",
    "privacy friendly tools",
  ],
});

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QR Code — Tools Hub",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/url/qr`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description:
      "Create QR codes from text, links, Wi-Fi, vCard, email, SMS, and WhatsApp. Customize colors, add logos, and export as PNG/SVG.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "URL/Text/Wi-Fi/vCard/Email/SMS/WhatsApp",
      "Error correction (L/M/Q/H)",
      "Custom colors & quiet zone",
      "Center logo overlay",
      "High-res PNG & SVG export",
      "Copy PNG data URL",
    ],
    creator: {
      "@type": "Person",
      name: "Tariqul Islam",
      url: "https://tariqul.dev",
    },
  };

  return (
    <div className="space-y-4">
      {/* JSON-LD */}
      <JsonLd data={jsonLd} />

      {/* Interactive client part */}
      <QRClient />
    </div>
  );
}
