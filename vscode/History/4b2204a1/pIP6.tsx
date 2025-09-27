import { ReferralDistributionData } from "@/types/dashboard";

interface Props {
  referralData: ReferralDistributionData[];
}

export default function OrderReferralTraffic({ referralData }: Props) {
  return (
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
                  `${getShortReferral(name)} ${(percent * 100).toFixed(0)}%`
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
  );
}
