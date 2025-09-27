import NotFound from "@/app/not-found";
import CarouselContainer from "@/components/global/carousel-container";
import ProductCard from "@/components/root/products/product-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/lib/actions/order.action";
import { getProducts } from "@/lib/actions/product.action";
import { getStatusColorClass } from "@/lib/utils/status";
import { OrderData } from "@/types/order";
import { ProductProps } from "@/types/product";
import { format } from "date-fns";
import { CheckCircle2, CreditCard, Package, Truck } from "lucide-react";
import Link from "next/link";
import { OrderReceiptClient } from "./order-receipt-client";

export const revalidate = 3600; // one hour cache
export const fetchCache = "force-cache"; // data caching

export default async function Receipt({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) {
  const { order_id } = await params;
  const arr = order_id.split("-");

  const [{ products = [] }, order]: [{ products: ProductProps[] }, OrderData] =
    await Promise.all([
      getProducts({
        limit: 6,
        sort: "default",
      }),
      getOrder(arr[0], arr[1]),
    ]);

  if (!order) return <NotFound />;

  const subtotal = order.product.salePrice * order.quantity;
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="pt-12">
      <section className="bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="bg-primary/5 relative pb-12">
          <div className="bg-primary/10 absolute -top-4 -right-4 h-24 w-24 rotate-12 transform rounded-full" />
          <div className="bg-primary/10 absolute -bottom-4 -left-4 h-24 w-24 -rotate-12 transform rounded-full" />
          <div className="relative pt-4">
            <div className="bg-background mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg">
              <CheckCircle2 className="text-primary h-10 w-10" />
            </div>
            <h2 className="text-center text-3xl font-bold">
              অর্ডার করার জন্য আপনাকে ধন্যবাদ
            </h2>
            <p className="text-muted-foreground mt-2 text-center text-base">
              আপনার অর্ডারটি কনফার্ম করা হয়েছে। অল্প সময়ের মধ্যে আপনার পার্সেলটা
              আপনার ঠিকানায় পাঠানোর ব্যবস্থা করা হবে। ইনশা-আল্লাহ।
            </p>
            <p className="mt-2 text-center">
              গ্যাস্ট্রিক থেকে মুক্তি লাভের বিভিন্ন প্রাকৃতিক উপায়, নিয়মিত
              বিভিন্ন প্রকার তথ্য এবং পরবর্তী সময়ে বিভিন্ন অফার জানতে আমাদের
              ফেসবুক পেজ অথবা হোয়াটসঅ্যাপ গ্রুপে যুক্ত হয়ে আমাদের সাথেই থাকুন।
              ধন্যবাদ
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                asChild
                variant="default"
                className="bg-accent-main hover:bg-accent-hover flex items-center gap-2 font-bold text-white shadow-lg transition-all duration-300"
              >
                <a
                  href="https://www.facebook.com/naturalsefabd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ফেসবুক পেজ
                </a>
              </Button>
              <Button
                asChild
                variant="default"
                className="bg-accent-main hover:bg-accent-hover flex items-center gap-2 font-bold text-white shadow-lg transition-all duration-300"
              >
                <a
                  href="https://chat.whatsapp.com/G62FiyRWJnN8zSvNhfmMhY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      clipRule="evenodd"
                    />
                  </svg>
                  হোয়াটসঅ্যাপ গ্রুপ
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="en space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-primary/5 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Package className="text-primary h-5 w-5" />
                  <CardTitle className="text-lg">Order Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-medium">
                    {format(new Date(order.createdAt), "PPP")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={`font-medium capitalize ${getStatusColorClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Truck className="text-primary h-5 w-5" />
                  <CardTitle className="text-lg">
                    Shipping Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span className="font-medium">{order.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <span className="font-medium">{order.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address</span>
                  <span className="font-medium">{order.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary h-5 w-5" />
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Details Group */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Product</span>
                  <span className="font-medium">
                    {order.product.title}{" "}
                    {order.product.packageDuration &&
                      `(${order.product.packageDuration})`}{" "}
                    x {order.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price</span>
                  <span className="font-medium">
                    ৳{order.product.salePrice}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing Details Group */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">৳{shipping}</span>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Total Amount */}
              <div className="bg-primary/10 flex justify-between rounded-lg p-3">
                <span className="font-semibold">Total Amount</span>
                <span className="text-primary text-lg font-bold">৳{total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <CardFooter className="bg-primary/5 flex flex-col space-y-4 border-t p-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <div className="flex-1">
                <OrderReceiptClient order={order} />
              </div>
            </div>
          </div>
        </CardFooter>
      </section>

      {/* Related Products Section */}
      {products.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">অন্যান্য পণ্য</h2>
          <CarouselContainer<ProductProps> items={products}>
            {(item: ProductProps) => <ProductCard product={item} />}
          </CarouselContainer>
        </section>
      )}
    </div>
  );
}
