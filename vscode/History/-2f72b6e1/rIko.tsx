import { ChildrenProps } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ order_id: string }>;
}): Promise<Metadata> {
  const { order_id } = await params;
  return {
    title: `Order Receipt ${order_id} | Natural Sefa`,
    description: `View your order receipt for order ${order_id} from Natural Sefa. Thank you for shopping with us!`,
    keywords: `Natural Sefa, order receipt, order ${order_id}, purchase, confirmation, Bangladesh, health products`,
    openGraph: {
      title: `Order Receipt ${order_id} | Natural Sefa`,
      description: `View your order receipt for order ${order_id} from Natural Sefa. Thank you for shopping with us!`,
      url: `https://www.naturalsefa.com/receipt/${order_id}`,
      siteName: "Natural Sefa",
      images: [
        {
          url: "/assets/hero-banner-1.webp",
          width: 1200,
          height: 630,
          alt: `Order Receipt ${order_id}`,
        },
      ],
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Order Receipt ${order_id} | Natural Sefa`,
      description: `View your order receipt for order ${order_id} from Natural Sefa. Thank you for shopping with us!`,
      images: ["/assets/hero-banner-1.webp"],
      site: "@naturalsefa",
    },
  };
}

export default function ReceiptLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
