"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LowStockItem = {
  id: string;
  title: string;
  stock: number;
  price?: string | null;
  compareAtPrice?: string | null;
  image: string | null;
};

export default function LowStockCard({ items }: { items: LowStockItem[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Low Stock</CardTitle>
        <span className="text-xs text-muted-foreground">Auto-refresh: 15m</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            All good — no low stock ✅
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Stock: {p.stock}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary">
                    Restock
                  </Button>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
