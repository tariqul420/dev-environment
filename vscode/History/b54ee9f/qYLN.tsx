export const revalidate = 3600; // one hour cache
export const fetchCache = "force-cache"; // data caching

import CarouselContainer from "@/components/global/carousel-container";
import Share from "@/components/global/share";
import BuyNowBtn from "@/components/root/products/buy-now-btn";
import ProductDetailsImage from "@/components/root/products/product-details-image";
import { headers } from "next/headers";

import NotFound from "@/app/not-found";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";
import ContentContainer from "@/components/global/content-container";
import ProductCard from "@/components/root/products/product-card";
import QuantityInput from "@/components/root/products/quantity-input";
import QuantityPrice from "@/components/root/products/quantity-price";
import ReviewCard from "@/components/root/products/review-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug, getProducts } from "@/lib/actions/product.action";
import { getReviews } from "@/lib/actions/review.action";
import { GetProductsResponse, IProduct, ProductProps } from "@/types/product";
import { ReviewProps } from "@/types/review";
import { Package, PhoneCall, Tag, Weight } from "lucide-react";

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const results = await Promise.all([
    getProducts({
      limit: 6,
      sort: "default",
    }),
    getProductBySlug(slug),
    getReviews(slug),
  ]);

  const [productsResponse, product, reviewsResponse] = results as [
    GetProductsResponse,
    IProduct,
    { reviews: ReviewProps[] },
  ];

  if (!product) return <NotFound />;

  // Get headers for URL construction
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  const shareUrl = `${protocol}://${host}/products/${slug}`;
  const shareText = `${product.title} - ${product.titleBengali}`;

  const categoryName =
    Array.isArray(product.categoryIds) && product.categoryIds.length > 0
      ? product.categoryIds
          .map((cat) =>
            cat && typeof cat === "object" && "name" in cat
              ? cat.name
              : "Unknown",
          )
          .join(", ")
      : "Uncategorized";

  return (
    <div className="py-12">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.title },
        ]}
      />
      <section className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-1/2">
          {/* Product Image */}
          <ProductDetailsImage
            images={product.imageUrls}
            name={product.title}
          />
        </div>
        <div className="md:w-1/2">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-medium">
                <span className="en">{product.title}</span> -{" "}
                {product.titleBengali}
              </h2>
              <p className="mt-2 line-clamp-2">{product.shortDesc}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span className="text-sm capitalize">
                  {product.tag || "No tag"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="text-sm">
                  {product.packageDuration || "Standard"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                <span className="text-sm">{product.weight}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-medium line-through">
                {product.regularPrice} ৳
              </span>
              <span className="text-accent-main text-3xl font-bold">
                {product.salePrice} ৳
              </span>
            </div>

            <div className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span>Hotline: +8809647-001177</span>
            </div>
          </div>

          <div className="mt-6">
            <QuantityPrice
              originalPrice={product.regularPrice}
              salePrice={product.salePrice}
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <QuantityInput />
            <Separator orientation="vertical" className="h-8" />
            <BuyNowBtn slug={product.slug || ""} />
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <span className="font-medium">Category:</span> {categoryName}
            </p>
            <Share url={shareUrl} text={shareText} />
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">বিস্তারিত বিবরণ</TabsTrigger>
            <TabsTrigger value="shipping">পরিবহন ও ডেলিভারি</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">পণ্যের নাম</h3>
              <p>
                {product.title} - {product.titleBengali}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">বিবরণ</h3>
              <p className="">{product.shortDesc}</p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">বিস্তারিত তথ্য</h3>
              <ContentContainer content={product.detailedDesc} />
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">ডেলিভারি তথ্য</h3>
              <p className="">
                আমরা আমাদের পণ্যগুলো বাংলাদেশের সর্বত্র ডেলিভারি করি। আপনার
                অবস্থানের উপর নির্ভর করে ডেলিভারি সময় ভিন্ন হতে পারে:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>ঢাকা সিটি: ১-২ কার্যদিবস</li>
                <li>অন্যান্য শহর: ২-৪ কার্যদিবস</li>
                <li>গ্রামীণ এলাকা: ৩-৫ কার্যদিবস</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">পরিবহন নীতি</h3>
              <p className="">
                আমরা বাংলাদেশের সারা দেশে বিনামূল্যে ডেলিভারি সুবিধা প্রদান করি।
                এই অফারটি আমাদের গ্রাহকদের জন্য একটি বিশেষ উপহার!
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">রিটার্ন নীতি</h3>
              <p className="">
                ডেলিভারির ৭ দিনের মধ্যে পণ্যটি খোলা না থাকলে এবং এর আসল
                প্যাকেজিংয়ে থাকলে আমরা রিটার্ন গ্রহণ করি। রিটার্নের জন্য আমাদের
                কাস্টমার সার্ভিসে যোগাযোগ করুন।
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">যোগাযোগের তথ্য</h3>
              <p className="">
                ডেলিভারি বা রিটার্ন সম্পর্কিত কোনো প্রশ্নের জন্য আমাদের সাথে
                যোগাযোগ করুন:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>হটলাইন: +8809647-001177</li>
                <li>ইমেইল: support@naturalsefa.com</li>
                <li>কার্যকাল: সকাল ৮:০০ - রাত ১২:০০ (বাংলাদেশ সময়)</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {reviewsResponse.reviews.length > 0 && (
        <>
          <Separator className="my-8" />

          <section>
            <h2 className="mb-6 text-2xl font-semibold">গ্রাহকদের মতামত</h2>
            <CarouselContainer<ReviewProps>
              items={reviewsResponse.reviews}
              className="md:basis-1/2 lg:basis-1/3"
            >
              {(item: ReviewProps) => <ReviewCard review={item} />}
            </CarouselContainer>
          </section>
        </>
      )}

      <Separator className="my-8" />

      {/* Related Products Section */}

      {productsResponse.products.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">অন্যান্য পণ্য</h2>
          <CarouselContainer<ProductProps> items={productsResponse.products}>
            {(item: ProductProps) => <ProductCard product={item} />}
          </CarouselContainer>
        </section>
      )}
    </div>
  );
}
