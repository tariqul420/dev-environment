'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Point = { date: string; clicks: number };

type Props = {
  data: Point[];
  height?: number;
  color?: string;
};

export default function ClicksByDayChart({ data, height = 220, color = 'hsl(var(--primary))' }: Props) {
  const id = React.useId();
  const gradientId = `fillClicks-${id}`;

  const grid = 'hsl(var(--muted-foreground) / 0.2)';
  const tick = 'hsl(var(--muted-foreground))';
  const bg = 'hsl(var(--popover))';
  const fg = 'hsl(var(--popover-foreground))';
  const border = 'hsl(var(--border))';

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={grid} strokeDasharray="3 3" />

          <XAxis dataKey="date" tickMargin={6} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tick }} />

          <YAxis allowDecimals={false} width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tick }} domain={[0, (max: number) => Math.max(2, Math.ceil(max))]} />

          {/* Built-in Tooltip only, styled with shadcn tokens */}
          <Tooltip
            cursor={{ stroke: grid }}
            formatter={(v: unknown) => [String(v), 'Clicks']}
            labelStyle={{ color: fg, fontSize: 12, marginBottom: 4 }}
            itemStyle={{ color: fg, fontSize: 12 }}
            contentStyle={{
              background: bg,
              color: fg,
              border: `1px solid ${border}`,
              borderRadius: 8,
              boxShadow: 'var(--shadow, 0 4px 12px rgba(0,0,0,.15))',
              padding: '6px 10px',
            }}
            wrapperStyle={{ outline: 'none' }}
          />

          <Area type="monotone" dataKey="clicks" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={{ r: 3, strokeWidth: 2, fill: 'hsl(var(--background))' }} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
