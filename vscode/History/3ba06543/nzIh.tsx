import { CheckCircle2, Clock, ShoppingCart, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

interface OrdersStatsProps {
  totalOrders: number;
  deliveredOrders: number;
  ongoingOrders: number;
  cancelledOrders: number;
}

export default function CustomerStats({
  ordersStats,
}: {
  ordersStats: OrdersStatsProps;
}) {
  const stats = [
    {
      title: "Total Orders",
      value: getFormatNumber(ordersStats.totalOrders),
      description: "All time orders",
      icon: ShoppingCart,
    },
    {
      title: "Confirmed & Delivered",
      value: getFormatNumber(ordersStats.deliveredOrders),
      description: "Successfully confirmed & delivered",
      icon: CheckCircle2,
    },
    {
      title: "Ongoing",
      value: getFormatNumber(ordersStats.ongoingOrders),
      description: "Currently processing",
      icon: Clock,
    },
    {
      title: "Cancelled",
      value: getFormatNumber(ordersStats.cancelledOrders),
      description: "Cancelled orders",
      icon: XCircle,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card mb-8 grid grid-cols-1 gap-5 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
