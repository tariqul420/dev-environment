export const revalidate = 60;
export const fetchCache = "default-cache";

import AboutUs from "@/components/root/home/about-us-section";
import BlogSection from "@/components/root/home/blog-section";
import CTASection from "@/components/root/home/cta-section";
import CustomerReview from "@/components/root/home/customer-review";
import FAQSection from "@/components/root/home/faq-section";
import HeroSection from "@/components/root/home/hero-section";
import OurProducts from "@/components/root/home/our-products";
import { Skeleton } from "@/components/ui/skeleton";
import { getBlogs } from "@/lib/actions/blog.action";
import { getProducts } from "@/lib/actions/product.action";
import { Suspense } from "react";

// Separate component for products section
async function ProductsSection() {
  const { products = [] } = await getProducts({
    limit: 8,
    sort: "default",
  });
  return <OurProducts products={products} />;
}

// Separate component for blogs section
async function BlogsSection() {
  const { blogs = [] } = await getBlogs({
    limit: 4,
    sort: "default",
  });
  return <BlogSection blogs={blogs} />;
}

export default async function Home() {
  return (
    <>
      <HeroSection />
      <Suspense
        fallback={
          <div className="container py-12">
            <Skeleton className="mb-8 h-8 w-48" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ProductsSection />
      </Suspense>
      <AboutUs />
      <CTASection />
      <Suspense
        fallback={
          <div className="container py-12">
            <Skeleton className="mb-8 h-8 w-48" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <BlogsSection />
      </Suspense>
      <FAQSection />
      <CustomerReview />
    </>
  );
}
