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
  RevenueStatsData,
} from "@/types/dashboard";
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
}

export function AdminCharts({
  sellingReport,
  revenueStats,
  productsStats,
  ordersStats,
  blogsStats,
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

  // Prepare data for area chart
  const areaData = sellingReport.slice(-30).map((item) => ({
    date: item.date,
    revenue: item.revenue,
    products: item.sales,
    orders: item.orders,
  }));

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
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart - Overall Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
            <CardDescription>Distribution of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
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
                    {pieChartData.map((entry, index) => (
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

        {/* Area Chart - Cumulative Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Metrics</CardTitle>
            <CardDescription>
              Stacked view of all metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={areaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="products"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                    name="Products"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.6}
                    name="Orders"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
