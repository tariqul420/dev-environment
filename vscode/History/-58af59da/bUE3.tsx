"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

type ChartDataPoint = {
  date: string;
  order: number; // all orders
  sales: number; // delivered
  revenue: number; // amount/metric
  completed?: number; // confirmed OR delivered
};

const chartConfig = {
  visitors: { label: "Order Summary" },
  order: { label: "Orders", color: "var(--color-order)" },
  completed: { label: "Completed", color: "var(--color-completed)" },
  sales: { label: "Sales", color: "var(--color-sales)" },
  revenue: { label: "Revenue", color: "var(--color-revenue)" },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  sellingReport,
}: {
  sellingReport: ChartDataPoint[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  // filter data by range + ensure completed
  const filteredData = React.useMemo(() => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const start = new Date(now);
    start.setDate(start.getDate() - days);

    return sellingReport
      .filter((d) => new Date(d.date) >= start)
      .map((d) => ({ ...d, completed: d.completed ?? 0 }));
  }, [sellingReport, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Sales and Orders</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v as typeof timeRange)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as typeof timeRange)}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {/* Orders */}
              <linearGradient
                id="fillOrder"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                style={{ color: "var(--color-order)" }}
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.9} />
                <stop
                  offset="95%"
                  stopColor="currentColor"
                  stopOpacity={0.12}
                />
              </linearGradient>

              {/* Completed */}
              <linearGradient
                id="fillCompleted"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                style={{ color: "var(--color-completed)" }}
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.85} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.1} />
              </linearGradient>

              {/* Sales */}
              <linearGradient
                id="fillSales"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                style={{ color: "var(--color-sales)" }}
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.8} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.1} />
              </linearGradient>

              {/* Revenue */}
              <linearGradient
                id="fillRevenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                style={{ color: "var(--color-revenue)" }}
              >
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.8} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) =>
                new Date(v as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) =>
                    new Date(v as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            {/* Orders */}
            <Area
              dataKey="order"
              type="natural"
              fill="url(#fillOrder)"
              style={{ stroke: "var(--color-order)" }}
              stackId="a"
            />

            {/* Completed (Confirmed OR Delivered) */}
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              style={{ stroke: "var(--color-completed)" }}
              stackId="a"
            />

            {/* Sales (Delivered) */}
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              style={{ stroke: "var(--color-sales)" }}
              stackId="a"
            />

            {/* Revenue */}
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              style={{ stroke: "var(--color-revenue)" }}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
