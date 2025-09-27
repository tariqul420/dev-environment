"use client";

import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BlogsStatsData,
  ChartData,
  OrdersStatsData,
  ProductsStatsData,
  ReferralDistributionData,
  RevenueStatsData,
  YearsRevenueData,
} from "@/types/dashboard";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
  "#E74C3C",
  "#2ECC71",
  "#1ABC9C",
  "#F1C40F",
  "#E67E22",
  "#34495E",
];

interface AdminChartsProps {
  sellingReport: ChartData[];
  revenueStats: RevenueStatsData;
  productsStats: ProductsStatsData;
  ordersStats: OrdersStatsData;
  blogsStats: BlogsStatsData;
  revenueData: YearsRevenueData[];
  referralData: ReferralDistributionData[];
}

export function AdminCharts({
  sellingReport,
  revenueStats,
  productsStats,
  ordersStats,
  blogsStats,
  revenueData,
  referralData,
}: AdminChartsProps) {
  // Transform data for ChartAreaInteractive
  const transformedData = sellingReport.map((item) => ({
    date: item.date,
    sales: item.sales,
    order: item.orders,
    revenue: item.revenue,
  }));

  // Prepare data for pie chart
  const pieChartData = [
    { name: "Revenue", value: Number(revenueStats.totalRevenue) },
    { name: "Products", value: productsStats.totalProducts },
    { name: "Orders", value: ordersStats.totalOrders },
    { name: "Blogs", value: blogsStats.totalBlogs },
  ];

  return (
    <>
      {/* Main Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales & Orders Overview</CardTitle>
          <CardDescription>
            Daily sales and orders for the last 3 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive sellingReport={transformedData} />
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Traffic</CardTitle>
          <CardDescription>Orders by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referralData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {referralData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
