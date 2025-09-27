import type { Decimal } from "@prisma/client/runtime/library";
import { Package } from "lucide-react";
import SubtleTopAccent from "@/components/global/subtle-top-accent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";
import { getStatusColorClass, getStatusLabel } from "@/lib/utils/status";

interface RecentOrder {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  status: string;
  total: Decimal;
  createdAt: Date;
  items: {
    title: string;
    qty: number;
  }[];
}

interface StaffRecentOrdersProps {
  orders: RecentOrder[];
}

export default function StaffRecentOrders({ orders }: StaffRecentOrdersProps) {
  if (!orders.length) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent orders found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{order.orderNo}</span>
                  <Badge className={getStatusColorClass(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>{order.customerName}</div>
                  <div>{order.customerPhone}</div>
                </div>

                <div className="text-sm">
                  {order.items.slice(0, 2).map((item, index) => (
                    <span key={`${order.id}-item-${index}`}>
                      {item.title} (×{item.qty})
                      {index < Math.min(order.items.length, 2) - 1 && ", "}
                    </span>
                  ))}
                  {order.items.length > 2 && (
                    <span className="text-muted-foreground">
                      {" "}
                      +{order.items.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">
                    ৳{getFormatNumber(Number(order.total))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <SubtleTopAccent />
    </Card>
  );
}
