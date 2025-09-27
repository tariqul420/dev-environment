import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BlogsStatsData,
  OrdersStatsData,
  ProductsStatsData,
  RevenueStatsData,
} from "@/types/dashboard";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  FileText,
  Package,
  ShoppingCart,
} from "lucide-react";

// Utility function to format numbers (e.g., 1000 -> 1k, 1600 -> 1.6k, 1000000 -> 1M)
const formatNumber = (value: number | string): string => {
  // Convert value to number if it's a string (e.g., for revenue with currency symbol)
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.]/g, ""))
      : value;

  if (isNaN(num)) return value.toString(); // Return original value if not a number

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`.replace(".0M", "M");
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`.replace(".0k", "k");
  }
  return num.toString();
};

interface AdminStatsProps {
  revenueStats: RevenueStatsData;
  productsStats: ProductsStatsData;
  ordersStats: OrdersStatsData;
  blogsStats: BlogsStatsData;
}

export async function AdminStats({
  revenueStats,
  productsStats,
  ordersStats,
  blogsStats,
}: AdminStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `৳ ${formatNumber(revenueStats.totalRevenue)}`,
      description: `${revenueStats.growthRate}% from last month`,
      icon: DollarSign,
      trend: revenueStats.trend,
    },
    {
      title: "Total Products",
      value: formatNumber(productsStats.totalProducts),
      description: `${productsStats.growthRate}% from last month`,
      icon: Package,
      trend: productsStats.trend,
    },
    {
      title: "Total Orders",
      value: formatNumber(ordersStats.totalOrders),
      description: `${ordersStats.growthRate}% from last month`,
      icon: ShoppingCart,
      trend: ordersStats.trend,
    },
    {
      title: "Total Blogs",
      value: formatNumber(blogsStats.totalBlogs),
      description: `${blogsStats.growthRate}% from last month`,
      icon: FileText,
      trend: blogsStats.trend,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
            <div className="mt-2 flex items-center text-xs">
              {stat.trend === "Up" ||
              stat.trend === "Trending up" ||
              stat.trend === "Strong order growth" ||
              stat.trend === "Content growing" ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              ) : stat.trend === "Down" ||
                stat.trend === "Trending down" ||
                stat.trend === "Order decline" ||
                stat.trend === "Content decline" ? (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={
                  stat.trend === "Up" ||
                  stat.trend === "Trending up" ||
                  stat.trend === "Strong order growth" ||
                  stat.trend === "Content growing"
                    ? "text-green-500"
                    : stat.trend === "Down" ||
                        stat.trend === "Trending down" ||
                        stat.trend === "Order decline" ||
                        stat.trend === "Content decline"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }
              >
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
