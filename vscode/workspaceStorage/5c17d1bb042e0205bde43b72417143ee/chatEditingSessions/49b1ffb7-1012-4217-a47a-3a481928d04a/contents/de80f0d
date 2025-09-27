import { TrendingUp, Calendar, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SpendingSummaryProps {
  totalSpent: number;
  monthlySpent: number;
  averageOrderValue: number;
  monthlyTarget?: number;
}

export default function SpendingSummary({
  totalSpent,
  monthlySpent,
  averageOrderValue,
  monthlyTarget = 5000,
}: SpendingSummaryProps) {
  const monthlyProgress = (monthlySpent / monthlyTarget) * 100;
  const remainingBudget = monthlyTarget - monthlySpent;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD").format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          খরচের সারসংক্ষেপ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Spending Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">এই মাসের খরচ</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(monthlySpent)} / {formatCurrency(monthlyTarget)} ৳
            </span>
          </div>
          <Progress value={Math.min(monthlyProgress, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {remainingBudget > 0 
              ? `আরো ${formatCurrency(remainingBudget)} ৳ বাকি`
              : `লক্ষ্য ${formatCurrency(Math.abs(remainingBudget))} ৳ অতিক্রম`
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">মোট খরচ</span>
            </div>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(totalSpent)} ৳
            </p>
          </div>

          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">গড় অর্ডার</span>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              {formatCurrency(averageOrderValue)} ৳
            </p>
          </div>
        </div>

        {/* Monthly comparison */}
        <div className="pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {monthlyProgress >= 100 
              ? "🎉 এই মাসে আপনার লক্ষ্য অর্জিত!"
              : "💰 বাজেটের মধ্যে আছেন"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}