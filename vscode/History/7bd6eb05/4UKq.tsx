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
  type ChartConfig,
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
import { useIsMobile } from "@/lib/hooks/use-mobile";

type ChartDataPoint = {
  date: string;
  order: number;
  completed: number;
  sales: number;
  revenue: number;
};

function allZero(data: ChartDataPoint[]) {
  if (!data?.length) return true;
  return data.every(
    (d) =>
      (d.order ?? 0) === 0 &&
      (d.completed ?? 0) === 0 &&
      (d.sales ?? 0) === 0 &&
      (d.revenue ?? 0) === 0,
  );
}

export default function ChartAreaInteractive({
  sellingReport,
}: {
  sellingReport: ChartDataPoint[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");

  const cOrder = "var(--chart-1, var(--primary))";
  const cCompleted = "var(--chart-2, var(--primary))";
  const cSales = "var(--chart-3, var(--primary))";
  const cRevenue = "var(--chart-4, var(--primary))";

  const chartConfig = React.useMemo(
    () =>
      ({
        order: { label: "Orders", color: cOrder },
        completed: { label: "Completed", color: cCompleted },
        sales: { label: "Sales", color: cSales },
        revenue: { label: "Revenue", color: cRevenue },
      }) satisfies ChartConfig,
    [],
  );

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return (sellingReport ?? [])
      .filter((d) => {
        const dt = new Date(d.date);
        return !Number.isNaN(+dt) && dt >= start && dt <= now;
      })
      .map((d) => ({
        ...d,
        completed: d.completed ?? 0,
        order: d.order ?? 0,
        sales: d.sales ?? 0,
        revenue: d.revenue ?? 0,
      }));
  }, [sellingReport, timeRange]);

  const isEmpty = allZero(filteredData);

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
          <AreaChart
            data={filteredData}
            margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
          >
            <defs>
              {/* Orders */}
              <linearGradient id="fillOrder" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cOrder} stopOpacity={0.9} />
                <stop offset="95%" stopColor={cOrder} stopOpacity={0.12} />
              </linearGradient>
              {/* Completed */}
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cCompleted} stopOpacity={0.85} />
                <stop offset="95%" stopColor={cCompleted} stopOpacity={0.1} />
              </linearGradient>
              {/* Sales */}
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cSales} stopOpacity={0.8} />
                <stop offset="95%" stopColor={cSales} stopOpacity={0.1} />
              </linearGradient>
              {/* Revenue */}
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cRevenue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={cRevenue} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Grid picks up theme border color */}
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(v) =>
                new Date(v as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={{
                stroke: "var(--muted-foreground)",
                strokeOpacity: 0.25,
              }}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) =>
                    new Date(v as string).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />

            <Area
              dataKey="order"
              type="natural"
              fill="url(#fillOrder)"
              stroke={cOrder}
              isAnimationActive={false}
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              stroke={cCompleted}
              isAnimationActive={false}
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              stroke={cSales}
              isAnimationActive={false}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke={cRevenue}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>

        {/* Subtle empty/zero-state without changing layout */}
        {isEmpty && (
          <div className="mt-3 rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
            No sales or orders in the selected range.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
