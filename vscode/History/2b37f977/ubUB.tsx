"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CartRow = {
  cartId: string;
  updatedAt: string;
  value: number;
  itemCount: number;
  sampleProduct: { id: string; title: string; image: string | null } | null;
};
type Summary = { count: number; avgValue: number };

export default function AbandonedCartsCard({
  summary,
  rows,
}: {
  summary: Summary;
  rows: CartRow[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Abandoned Carts</CardTitle>
        <div className="text-xs text-muted-foreground">
          {summary.count} carts • Avg ৳{summary.avgValue}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Looks clean — no abandoned carts in the window.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li
                key={r.cartId}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                  {r.sampleProduct?.image ? (
                    <Image
                      src={r.sampleProduct.image}
                      alt={r.sampleProduct.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {r.sampleProduct?.title ?? "Cart"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Items: {r.itemCount} • Value: ৳{r.value} • Updated:{" "}
                    {new Date(r.updatedAt).toLocaleString()}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Recover
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
