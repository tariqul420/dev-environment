import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartData } from "@/types/dashboard";

interface AdminChartsProps {
  sellingReport: ChartData[];
}

export function AdminCharts({ sellingReport }: AdminChartsProps) {
  const transformedData = sellingReport.map((item) => ({
    date: item.date,
    order: item.orders,
    completed: item.completed,
    sales: item.sales,
    revenue: item.revenue,
  }));

  return (
    <>
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
