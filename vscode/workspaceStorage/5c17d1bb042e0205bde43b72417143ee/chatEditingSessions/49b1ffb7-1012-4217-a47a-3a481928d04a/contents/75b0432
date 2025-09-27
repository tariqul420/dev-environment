import { DollarSign, TrendingUp, Calendar, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

interface SpendingSummaryProps {
  totalSpent: number;
  averageOrderValue: number;
  thisMonthSpent: number;
  totalCompletedOrders: number;
}

export default function SpendingSummary({ spendingData }: { spendingData: SpendingSummaryProps }) {
  const stats = [
    {
      title: "Total Spent",
      value: `৳${getFormatNumber(spendingData.totalSpent)}`,
      description: "All time spending",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Average Order",
      value: `৳${getFormatNumber(spendingData.averageOrderValue)}`,
      description: "Per order average",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "This Month",
      value: `৳${getFormatNumber(spendingData.thisMonthSpent)}`,
      description: "Current month spending",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Completed Orders",
      value: getFormatNumber(spendingData.totalCompletedOrders),
      description: "Successfully delivered",
      icon: ShoppingCart,
      color: "text-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5" />
          Spending Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="text-center">
              <div className={`inline-flex p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
