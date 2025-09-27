import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartAreaInteractive from "../chart-area-interactive";

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
    <Card className="relative">
      <CardHeader>
        <CardTitle>Sales & Orders Overview</CardTitle>
        <CardDescription>
          Daily sales and orders for the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartAreaInteractive sellingReport={transformedData} />
      </CardContent>

      {/* Subtle top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </Card>
  );
}
