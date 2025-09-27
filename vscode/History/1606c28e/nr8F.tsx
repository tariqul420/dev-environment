import {
  BadgeCheck,
  Package,
  PhoneCall,
  ShieldCheck,
  Tag,
  Truck,
  Weight,
} from "lucide-react";
import NotFound from "@/app/not-found";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";
import ContentContainer from "@/components/root/content-container";
import AddToCartButton from "@/components/root/products/add-to-cart-button";
import BuyNowBtn from "@/components/root/products/buy-now-btn";
import ProductDetailsImage from "@/components/root/products/product-details-image";
import QuantityInput from "@/components/root/products/quantity-input";
import QuantityPrice from "@/components/root/products/quantity-price";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSingleProductPublic } from "@/lib/actions/product.action";

export default async function Product({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getSingleProductPublic(id);
  if (!product) return <NotFound />;

  console.log(product);

  const categoryName =
    Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories.map((cat) => cat.name || "Unknown").join(", ")
      : "Uncategorized";

  const stock =
    typeof product.stock === "number"
      ? product.stock
      : Number(product.stock ?? 0);

  const inStock = stock > 0;

  const price =
    product.price != null && product.price !== ""
      ? Number(product.price)
      : undefined;

  const compareAtPrice =
    product.compareAtPrice != null && product.compareAtPrice !== ""
      ? Number(product.compareAtPrice)
      : undefined;

  const hasDiscount =
    typeof price === "number" &&
    typeof compareAtPrice === "number" &&
    !Number.isNaN(price) &&
    !Number.isNaN(compareAtPrice) &&
    compareAtPrice > 0 &&
    compareAtPrice > price;

  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : undefined;

  return (
    <>
      <div className="py-10">
        <BreadcrumbContainer
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: product.title },
          ]}
        />

        {/* Top section */}
        <section className="grid gap-8 lg:grid-cols-2">
          {/* Left: premium gallery */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ProductDetailsImage
              images={product.images?.map((img) => img.url) || []}
              name={product.title}
              outOfStock={!inStock}
              tag={product.tag}
              discountPercent={discountPercent}
            />
          </div>

          {/* Right: summary */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Title + short */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold leading-tight">
                <span className="font-grotesk">{product.title}</span>
              </h1>
              {product.shortDescription ? (
                <p className="text-sm text-muted-foreground">
                  {product.shortDescription}
                </p>
              ) : null}
            </div>

            {/* chips */}
            <div className="flex flex-wrap items-center gap-3">
              {product.tag ? (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                  <Tag className="h-3.5 w-3.5" />{" "}
                  <span className="capitalize">{product.tag}</span>
                </span>
              ) : null}
              {product.packageDuration ? (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                  <Package className="h-3.5 w-3.5" /> {product.packageDuration}
                </span>
              ) : null}
              {product.packageWeight ? (
                <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                  <Weight className="h-3.5 w-3.5" /> {product.packageWeight}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                <Truck className="h-3.5 w-3.5" /> Fast delivery
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout
              </span>
            </div>

            {/* pricing */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-accent-main">
                {price} ৳
              </span>

              {hasDiscount && (
                <span className="pb-1 text-sm text-muted-foreground line-through">
                  {compareAtPrice} ৳
                </span>
              )}

              {hasDiscount && typeof discountPercent === "number" && (
                <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* hotline */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="inline-flex items-center gap-2">
                <PhoneCall size={16} />
                <span>Hotline: +8809647-001177</span>
              </div>
            </div>

            <Separator />

            {/* quantity + CTA */}
            <div className="space-y-4">
              <QuantityPrice
                compareAtPrice={compareAtPrice as number}
                price={price as number}
                id={product.id}
              />
              <div className="flex items-center gap-4">
                <QuantityInput id={product.id} disabled={!inStock} />
                <BuyNowBtn product={product} isOut={!inStock} />
                <AddToCartButton product={product} isOut={!inStock} />
              </div>
              {!inStock && (
                <p className="text-xs text-muted-foreground">
                  এই পণ্যটি বর্তমানে স্টকে নেই। শীঘ্রই পুনরায় উপলভ্য হবে।
                </p>
              )}
            </div>

            <Separator />

            {/* meta */}
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Category:</span> {categoryName}
              </p>
              <p className="inline-flex items-center gap-1 text-muted-foreground">
                <BadgeCheck className="h-4 w-4" /> 100% Authentic Product
              </p>
            </div>
          </aside>
        </section>

        {/* Tabs & Description at bottom */}
        <section className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">বিস্তারিত</TabsTrigger>
              <TabsTrigger value="shipping">ডেলিভারি</TabsTrigger>
              <TabsTrigger value="returns">রিটার্ন</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 space-y-6">
              <ContentContainer content={product.description || ""} />
            </TabsContent>

            <TabsContent value="shipping" className="mt-6 space-y-4">
              <div className="flex items-center gap-2 font-medium">
                <Truck className="h-4 w-4" />
                ডেলিভারি সময়সূচি (বাংলাদেশ)
              </div>
              <ul className="list-inside list-disc space-y-1">
                <li>ঢাকা সিটি: সাধারণত ১–২ কার্যদিবস</li>
                <li>অন্য জেলা/সিটি: ২–৪ কার্যদিবস</li>
                <li>উপজেলা/গ্রামীণ এলাকা: ৩–৫ কার্যদিবস</li>
              </ul>

              <div className="font-medium">পেমেন্ট অপশন</div>
              <ul className="list-inside list-disc space-y-1">
                <li>ক্যাশ অন ডেলিভারি (COD)</li>
                <li>বিকাশ/নগদ/কার্ড – অনলাইন পেমেন্ট</li>
              </ul>

              <p className="text-muted-foreground">
                নোট: সরকারি ছুটি/বিশেষ পরিস্থিতিতে ডেলিভারি সময় বাড়তে পারে।
              </p>
            </TabsContent>

            <TabsContent value="returns" className="mt-6 space-y-4">
              <div className="font-medium">রিটার্ন নীতি</div>
              <ul className="list-inside list-disc space-y-1">
                <li>ডেলিভারির ৭ দিনের মধ্যে রিটার্ন/এক্সচেঞ্জের আবেদন করতে হবে</li>
                <li>পণ্য অবশ্যই আনওপেনড, আনইউজড এবং আসল প্যাকেজিংসহ হতে হবে</li>
                <li>ভুল/ড্যামেজ/ডিফেক্টিভ পণ্য পেলে কুরিয়ার রিসিপ্টসহ জানান</li>
              </ul>

              <div className="font-medium">রিটার্ন প্রযোজ্য নয়</div>
              <ul className="list-inside list-disc space-y-1">
                <li>কনসিউমেবল/ফুড/হার্বাল পণ্য খোলা থাকলে</li>
                <li>মেয়াদোত্তীর্ণ পণ্য (ডেলিভারির পরে দীর্ঘদিন রেখে দেওয়া)</li>
                <li>যে কোনো হাইজিন-ক্রিটিকাল পণ্য ব্যবহৃত হলে</li>
              </ul>

              <div className="font-medium">কিভাবে রিটার্ন করবেন</div>
              <ol className="list-inside list-decimal space-y-1">
                <li>হটলাইন: +8809647-001177 / ইনবক্সে অর্ডার নম্বর দিয়ে জানান</li>
                <li>পণ্যটি নিরাপদে প্যাক করুন ও কুরিয়ারে পাঠান/কলেকশন নিন</li>
                <li>চেক সম্পন্ন হলে রিফান্ড/রিপ্লেসমেন্ট প্রসেস করা হবে</li>
              </ol>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-accent-main">
              {price} ৳
            </span>

            {hasDiscount && (
              <span className="pb-1 text-sm text-muted-foreground line-through">
                {compareAtPrice} ৳
              </span>
            )}

            {hasDiscount && typeof discountPercent === "number" && (
              <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <QuantityInput id={product.id} disabled={!inStock} />
            <BuyNowBtn product={product} isOut={!inStock} />
            <AddToCartButton product={product} isOut={!inStock} />
          </div>
        </div>

        {!inStock && (
          <p className="mt-2 text-center text-xs text-destructive">
            Out of stock — এই মুহূর্তে অর্ডার করা যাবে না
          </p>
        )}
      </div>
    </>
  );
}
