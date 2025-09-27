import {
  CheckCircle2,
  Clock,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

interface StaffStatsProps {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  todayOrders: number;
  totalCustomers: number;
  monthlyRevenue: number;
}

export default function StaffStats({
  statsData,
}: {
  statsData: StaffStatsProps;
}) {
  const stats = [
    {
      title: "Total Orders",
      value: getFormatNumber(statsData.totalOrders),
      description: "All time orders",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Pending Orders",
      value: getFormatNumber(statsData.pendingOrders),
      description: "Needs attention",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
      title: "Processing",
      value: getFormatNumber(statsData.processingOrders),
      description: "In progress",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Delivered",
      value: getFormatNumber(statsData.deliveredOrders),
      description: "Successfully completed",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
    },
    {
      title: "Today's Orders",
      value: getFormatNumber(statsData.todayOrders),
      description: "Orders received today",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      title: "Total Customers",
      value: getFormatNumber(statsData.totalCustomers),
      description: "Registered customers",
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
