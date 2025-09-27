import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  FileText,
  Minus,
  Package,
  ShoppingCart,
} from "lucide-react";
import SubtleTopAccent from "@/components/global/subtle-top-accent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormatNumber } from "@/lib/utils/get-format-number";

type TrendText =
  | "Up"
  | "Trending up"
  | "Strong order growth"
  | "Content growing"
  | "Down"
  | "Trending down"
  | "Order decline"
  | "Content decline"
  | "Stable"
  | string;

interface RevenueStatsData {
  totalRevenue: string | number;
  growthRate: number | null;
  trend: TrendText;
  monthlyRevenue: { month: string; totalRevenue: number }[];
}
interface ProductsStatsData {
  totalProducts: number;
  growthRate: number | null;
  trend: TrendText;
  monthlyProducts: { month: string; productCount: number }[];
}
interface OrdersStatsData {
  totalOrders: number;
  growthRate: number | null;
  trend: TrendText;
  monthlyOrders: { month: string; orderCount: number }[];
}
interface BlogsStatsData {
  totalBlogs: number;
  growthRate: number | null;
  trend: TrendText;
  monthlyBlogs: { month: string; blogCount: number }[];
}

interface AdminStatsProps {
  revenueStats: RevenueStatsData;
  productsStats: ProductsStatsData;
  ordersStats: OrdersStatsData;
  blogsStats: BlogsStatsData;
}

function isPositiveTrend(trend: TrendText) {
  return (
    trend === "Up" ||
    trend === "Trending up" ||
    trend === "Strong order growth" ||
    trend === "Content growing"
  );
}
function isNegativeTrend(trend: TrendText) {
  return (
    trend === "Down" ||
    trend === "Trending down" ||
    trend === "Order decline" ||
    trend === "Content decline"
  );
}

function getTrendMeta(trend: TrendText) {
  if (isPositiveTrend(trend)) {
    return {
      Icon: ArrowUpIcon,
      textClass: "text-green-500",
      iconClass: "text-green-500",
    };
  }
  if (isNegativeTrend(trend)) {
    return {
      Icon: ArrowDownIcon,
      textClass: "text-red-500",
      iconClass: "text-red-500",
    };
  }
  return {
    Icon: Minus,
    textClass: "text-muted-foreground",
    iconClass: "text-muted-foreground",
  };
}

function fmtGrowth(growth: number | null | undefined) {
  if (growth === null || growth === undefined) return "—";
  return `${growth}%`;
}

function allZero({
  revenueStats,
  productsStats,
  ordersStats,
  blogsStats,
}: AdminStatsProps) {
  const rev = Number(revenueStats.totalRevenue) || 0;
  return (
    rev === 0 &&
    (productsStats.totalProducts || 0) === 0 &&
    (ordersStats.totalOrders || 0) === 0 &&
    (blogsStats.totalBlogs || 0) === 0
  );
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
      value: `৳ ${getFormatNumber(revenueStats.totalRevenue)}`,
      description:
        revenueStats.growthRate && revenueStats.growthRate !== 0
          ? `${fmtGrowth(revenueStats.growthRate)} from last month`
          : "No change from last month",
      icon: DollarSign,
      trend: revenueStats.trend || "Stable",
    },
    {
      title: "Total Products",
      value: getFormatNumber(productsStats.totalProducts),
      description:
        productsStats.growthRate && productsStats.growthRate !== 0
          ? `${fmtGrowth(productsStats.growthRate)} from last month`
          : "No change from last month",
      icon: Package,
      trend: productsStats.trend || "Stable",
    },
    {
      title: "Total Orders",
      value: getFormatNumber(ordersStats.totalOrders),
      description:
        ordersStats.growthRate && ordersStats.growthRate !== 0
          ? `${fmtGrowth(ordersStats.growthRate)} from last month`
          : "No change from last month",
      icon: ShoppingCart,
      trend: ordersStats.trend || "Stable",
    },
    {
      title: "Total Blogs",
      value: getFormatNumber(blogsStats.totalBlogs),
      description:
        blogsStats.growthRate && blogsStats.growthRate !== 0
          ? `${fmtGrowth(blogsStats.growthRate)} from last month`
          : "No change from last month",
      icon: FileText,
      trend: blogsStats.trend || "Stable",
    },
  ];

  const showEmpty = allZero({
    revenueStats,
    productsStats,
    ordersStats,
    blogsStats,
  });

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
      {stats.map((stat) => {
        const {
          Icon: TrendIcon,
          textClass,
          iconClass,
        } = getTrendMeta(stat.trend);
        return (
          <Card
            key={stat.title}
            data-slot="card"
            className="relative overflow-hidden bg-gradient-to-t from-primary/5 to-card shadow-xs @container/card"
          >
            <SubtleTopAccent />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>

              {/* Description / growth */}
              <p
                className={`mt-1 text-xs ${
                  /No change/i.test(stat.description)
                    ? "text-muted-foreground"
                    : "text-foreground/80"
                }`}
              >
                {stat.description}
              </p>

              {/* Trend chip */}
              <div className="mt-3 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
                <TrendIcon className={`h-3.5 w-3.5 ${iconClass}`} />
                <span className={textClass}>{stat.trend || "Stable"}</span>
              </div>
            </CardContent>

            {/* Empty stripe if value is zero */}
            {String(stat.value).match(/(^0$|৳\s?0(\.00)?$)/) && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-muted/60 to-transparent" />
            )}
          </Card>
        );
      })}

      {/* Friendly empty-state (only when everything is zero) */}
      {showEmpty && (
        <Card className="col-span-1 @xl/main:col-span-2 @4xl/main:col-span-4 border-dashed">
          <CardContent className="flex flex-col items-start justify-center gap-2 py-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs">
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">No activity yet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Add products, publish blogs, and capture orders to see your
              dashboard come alive.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
