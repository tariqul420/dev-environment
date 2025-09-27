export type ChartData = {
  date: string;
  sales: number;
  completed: number;
  orders: number;
  revenue: number;
};

export type StatsData = {
  growthRate: number;
  trend: string;
};

export interface RevenueStatsData extends StatsData {
  totalRevenue: string;
}

export interface ProductsStatsData extends StatsData {
  totalProducts: number;
}

export interface OrdersStatsData extends StatsData {
  totalOrders: number;
}

export interface BlogsStatsData extends StatsData {
  totalBlogs: number;
}

export interface YearsRevenueData {
  month: string;
  revenue: number;
}

export interface ReferralDistributionData {
  name: string;
  value: number;
}
