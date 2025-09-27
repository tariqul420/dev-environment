import { getProductBySlug } from "@/lib/actions/product.action";
import { ChildrenProps, SlugParams } from "@/types";
import type { Category } from "@/types/product";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: SlugParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Compose category names if available
  const categoryNames = Array.isArray(product.categoryIds)
    ? product.categoryIds
        .map((cat: string | Category) =>
          typeof cat === "object" && "name" in cat ? cat.name : cat,
        )
        .join(", ")
    : "Uncategorized";

  // Compose keywords from all relevant fields
  const keywords = [
    "Natural Sefa",
    "product",
    product.title,
    product.titleBengali,
    product.tag,
    categoryNames,
    slug,
    ...(product.keywords || []),
  ]
    .filter(Boolean)
    .join(", ");

  // Use the first image as the main image
  const mainImage =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "/assets/hero-banner-1.webp";

  // Compose a detailed description
  const description = `${product.shortDesc} | ${product.detailedDesc} | Category: ${categoryNames} | Weight: ${product.weight} | Package: ${product.packageDuration} | Tag: ${product.tag || "No tag"}`;

  return {
    title: `${product.title} (${product.titleBengali}) | Natural Sefa`,
    description,
    keywords,
    openGraph: {
      title: `${product.title} (${product.titleBengali}) | Natural Sefa`,
      description,
      url: `https://www.naturalsefa.com/products/${slug}`,
      siteName: "Natural Sefa",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} (${product.titleBengali}) | Natural Sefa`,
      description,
      images: [mainImage],
      site: "@naturalsefa",
    },
    other: {
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      weight: product.weight,
      packageDuration: product.packageDuration,
      tag: product.tag,
      category: categoryNames,
      slug: product.slug,
    },
  };
}

export default function ProductLayout({ children }: ChildrenProps) {
  return <main>{children}</main>;
}
