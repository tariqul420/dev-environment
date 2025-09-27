"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TrendingItem = {
  id: string;
  title: string;
  image: string | null;
  price?: string | null;
  compareAtPrice?: string | null;
  soldQty: number;
  revenue: string;
};

export default function TrendingProductsCard({
  items,
}: {
  items: TrendingItem[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Trending Products (Last 30 days)</CardTitle>
        <span className="text-xs text-muted-foreground">
          Sorted by units sold
        </span>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sales data yet.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => {
              const hasDiscount =
                p.compareAtPrice &&
                p.price &&
                Number(p.price) < Number(p.compareAtPrice);
              const discountPct =
                hasDiscount && p.compareAtPrice && p.price
                  ? Math.round(
                      ((Number(p.compareAtPrice) - Number(p.price)) /
                        Number(p.compareAtPrice)) *
                        100,
                    )
                  : null;

              return (
                <li
                  key={p.id}
                  className="group rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-md bg-muted">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={56}
                          height={56}
                          className="h-14 w-14 object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Sold: {p.soldQty} • Rev: ৳
                        {Number(p.revenue).toLocaleString("en-US")}
                      </div>
                    </div>
                    {discountPct ? (
                      <Badge variant="secondary">-{discountPct}%</Badge>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
