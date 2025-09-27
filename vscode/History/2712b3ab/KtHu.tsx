export const revalidate = 60;

import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";
import CheckoutForm from "@/components/root/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/actions/product.action";
import Link from "next/link";

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ slug: string; quantity: string }>;
}) {
  const { slug, quantity } = await searchParams;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 text-xl font-semibold">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, the product you&apos;re looking for is not available.
        </p>
        <Button asChild>
          <Link href="/products">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const subtotal = product.salePrice * Number(quantity);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="py-12">
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.name, href: `/products/${product.slug}` },
          { label: "Checkout" },
        ]}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Billing & Shipping Section */}
        <Card>
          <CardHeader>
            <CardTitle>BILLING & SHIPPING</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutForm product={product._id} quantity={Number(quantity)} />
          </CardContent>
        </Card>

        {/* Your Order Section */}
        <Card className="en">
          <CardHeader>
            <CardTitle>YOUR ORDER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Details Group */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2 font-semibold">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {product.title} x {quantity}
                </span>
                <span>{product.salePrice}৳</span>
              </div>
            </div>

            <Separator />

            {/* Pricing Details Group */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{subtotal}৳</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">{shipping}৳</span>
              </div>
            </div>

            <Separator />

            {/* Total Amount */}
            <div className="bg-primary/10 flex justify-between rounded-lg p-3">
              <span className="font-semibold">Total Amount</span>
              <span className="text-primary text-lg font-bold">{total}৳</span>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <RadioGroup defaultValue="cash-on-delivery">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="cash-on-delivery"
                    id="cash-on-delivery"
                  />
                  <Label htmlFor="cash-on-delivery">
                    Cash on delivery || ক্যাশ অন ডেলিভারি
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-muted-foreground text-sm">
                পণ্য হাতে পেয়ে ডেলিভারি চার্জ সহ পণ্যের মূল্য পরিশোধ করুন।
              </p>
            </div>

            {/* Privacy Policy */}
            <p className="text-muted-foreground text-sm">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              <a
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                privacy policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
