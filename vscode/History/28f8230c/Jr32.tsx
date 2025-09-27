"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import InitialCheckoutTracking from "@/components/analytics/initial-checkout-tracking";
import { BreadcrumbContainer } from "@/components/global/breadcrumb-container";
import CheckoutForm from "@/components/root/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCart from "@/lib/hooks/use-cart";

type DirectPayload = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string | null;
  ts?: number;
};

export default function CheckoutPage() {
  const params = useSearchParams();
  const modeParam = params?.get("mode");
  const isDirectParam = modeParam === "direct";

  const { items: cartItems, subtotal: cartSubtotal } = useCart();

  const [direct, setDirect] = useState<DirectPayload | null>(null);
  const [loading, setLoading] = useState(isDirectParam);

  useEffect(() => {
    if (!isDirectParam) return;
    setLoading(true);
    try {
      const raw = localStorage.getItem("ns_direct_checkout");
      if (!raw) {
        setDirect(null);
      } else {
        const parsed = JSON.parse(raw) as DirectPayload;
        const expired = parsed?.ts && Date.now() - parsed.ts > 30 * 60 * 1000;
        setDirect(expired ? null : parsed);
      }
    } catch {
      setDirect(null);
    } finally {
      setLoading(false);
    }
  }, [isDirectParam]);

  const isDirect = isDirectParam && !!direct;

  const summary = useMemo(() => {
    if (isDirect && direct) {
      const subtotal = direct.price * direct.qty;
      const shipping = 0;
      return { subtotal, shipping, total: subtotal + shipping };
    }
    const shipping = 0;
    return { subtotal: cartSubtotal, shipping, total: cartSubtotal + shipping };
  }, [isDirect, direct, cartSubtotal]);

  const showDirectEmpty =
    isDirectParam && !loading && (!direct || !direct.id || !direct.qty);

  return (
    <main className="py-8">
      {isDirect && direct ? (
        <InitialCheckoutTracking
          mode="direct"
          product={{
            id: direct.id,
            title: direct.title,
            price: direct.price,
            qty: direct.qty,
            total: summary.total, // optional; will compute if omitted
            currency: "BDT",
          }}
        />
      ) : (
        <InitialCheckoutTracking
          mode="cart"
          product={{
            items: cartItems.map((it) => ({
              id: it.id,
              title: it.title,
              price: it.price,
              qty: it.qty,
            })),
            total: summary.total, // optional
            currency: "BDT",
          }}
        />
      )}
      <BreadcrumbContainer
        className="mb-4"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: "Checkout" },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Billing & Shipping */}
        <Card className="font-bangle h-fit">
          <CardHeader>
            <CardTitle>BILLING & SHIPPING</CardTitle>
          </CardHeader>
          <CardContent>
            {showDirectEmpty ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your direct checkout session expired or is missing.
                </p>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/cart">Go to Cart</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <CheckoutForm
                mode={isDirect ? "direct" : "cart"}
                directItem={
                  isDirect && direct
                    ? { id: direct.id, qty: direct.qty }
                    : undefined
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="font-english h-fit">
          <CardHeader>
            <CardTitle>YOUR ORDER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product List */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2 font-semibold">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>

              {loading && (
                <p className="text-sm text-muted-foreground">Loading…</p>
              )}

              {isDirect && direct && (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image
                        src={direct.image ?? "/placeholder.png"}
                        alt={direct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>
                      {direct.title} × {direct.qty}
                    </span>
                  </div>
                  <span>{(direct.price * direct.qty).toFixed(2)}৳</span>
                </div>
              )}

              {!isDirect &&
                cartItems.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded">
                        <Image
                          src={it.image ?? "/placeholder.png"}
                          alt={it.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>
                        {it.title} × {it.qty}
                      </span>
                    </div>
                    <span>{(it.price * it.qty).toFixed(2)}৳</span>
                  </div>
                ))}

              {showDirectEmpty && (
                <p className="text-sm text-muted-foreground">
                  Nothing to checkout directly. Please choose a product again or
                  proceed from your cart.
                </p>
              )}
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{summary.subtotal}৳</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">{summary.shipping}৳</span>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="bg-primary/10 flex justify-between rounded-lg p-3">
              <span className="font-semibold">Total Amount</span>
              <span className="text-primary text-lg font-bold">
                {summary.total}৳
              </span>
            </div>

            {!isDirect && (
              <p className="text-sm text-muted-foreground">
                You’re checking out multiple items from your cart.{" "}
                <Button asChild variant="link" className="px-0">
                  <Link href="/cart">Edit items</Link>
                </Button>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
