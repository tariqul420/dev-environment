import { Award, Calendar, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getFormatNumber } from "@/lib/utils/get-format-number";

interface PerformanceData {
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  orderProcessingRate: number; // percentage
  customerSatisfaction: number; // percentage
}

interface StaffPerformanceProps {
  performanceData: PerformanceData;
}

export default function StaffPerformance({
  performanceData,
}: StaffPerformanceProps) {
  const metrics = [
    {
      title: "Today's Performance",
      items: [
        {
          label: "Orders Processed",
          value: getFormatNumber(performanceData.todayOrders),
          subtext: `৳${getFormatNumber(performanceData.todayRevenue)} revenue`,
          icon: Calendar,
          color: "text-blue-600",
        },
      ],
    },
    {
      title: "Weekly Summary",
      items: [
        {
          label: "Weekly Orders",
          value: getFormatNumber(performanceData.weeklyOrders),
          subtext: `৳${getFormatNumber(performanceData.weeklyRevenue)} revenue`,
          icon: TrendingUp,
          color: "text-green-600",
        },
      ],
    },
    {
      title: "Monthly Stats",
      items: [
        {
          label: "Monthly Orders",
          value: getFormatNumber(performanceData.monthlyOrders),
          subtext: `৳${getFormatNumber(performanceData.monthlyRevenue)} revenue`,
          icon: Target,
          color: "text-purple-600",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metric.items.map((item) => (
                <div key={item.label} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Processing Rate</span>
              <span className="font-medium">
                {performanceData.orderProcessingRate}%
              </span>
            </div>
            <Progress
              value={performanceData.orderProcessingRate}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {performanceData.orderProcessingRate >= 90
                ? "Excellent performance!"
                : performanceData.orderProcessingRate >= 75
                  ? "Good performance"
                  : "Needs improvement"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Customer Satisfaction</span>
              <span className="font-medium">
                {performanceData.customerSatisfaction}%
              </span>
            </div>
            <Progress
              value={performanceData.customerSatisfaction}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {performanceData.customerSatisfaction >= 95
                ? "Outstanding service!"
                : performanceData.customerSatisfaction >= 85
                  ? "Great service"
                  : "Room for improvement"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
