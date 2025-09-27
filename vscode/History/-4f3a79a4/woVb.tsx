"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type MixRow = {
  method: "COD" | "BKASH" | "NAGAD" | "CARD" | "BANK";
  orders: number;
  amount: string;
  sharePct: number;
};

export default function PaymentMixCard({ data }: { data: MixRow[] }) {
  const total = data.reduce((a, r) => a + r.orders, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Mix (30d)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          data.map((row) => (
            <div key={row.method} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{row.method}</span>
                <span className="text-muted-foreground">
                  {row.orders} ({row.sharePct}%)
                </span>
              </div>
              <Progress value={row.sharePct} />
            </div>
          ))
        )}
        {total > 0 && (
          <div className="pt-1 text-xs text-muted-foreground">
            Total orders: {total}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
