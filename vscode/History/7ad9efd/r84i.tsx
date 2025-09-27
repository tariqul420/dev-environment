import type { Decimal } from "@prisma/client/runtime/library";
import { Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "processing":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export default function StaffRecentOrders({ orders }: StaffRecentOrdersProps) {
  if (!orders.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{order.orderNo}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
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
    </Card>
  );
}
