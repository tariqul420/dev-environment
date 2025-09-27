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
  ChartData,
  ReferralDistributionData,
  YearsRevenueData,
} from "@/types/dashboard";

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
  revenueData: YearsRevenueData[];
  referralData: ReferralDistributionData[];
}

export function AdminCharts({
  sellingReport,
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
    </>
  );
}
