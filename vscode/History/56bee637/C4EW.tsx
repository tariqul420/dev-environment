'use client';

import * as React from 'react';
import type { TooltipProps } from 'recharts';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type Point = { date: string; clicks: number };

type Props = {
  data: Point[];
  height?: number;
  /** Line / area color (defaults to primary) */
  color?: string;
};

export default function ClicksByDayChart({ data, height = 220, color = 'hsl(var(--primary))' }: Props) {
  const id = React.useId();
  const gradientId = `fillClicks-${id}`;
  const grid = 'hsl(var(--muted-foreground) / 0.2)';
  const tick = 'hsl(var(--muted-foreground))';

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

          <YAxis allowDecimals={false} width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tick }} />

          <Tooltip cursor={{ stroke: grid }} content={<CustomTooltip />} />

          <Area type="monotone" dataKey="clicks" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---- Custom tooltip (dark-mode friendly) ---- */
function CustomTooltip(p: TooltipProps<ValueType, NameType>) {
  const { active, payload, label } = p; // <-- destructure *inside*

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md">
      <div className="font-medium">{String(label)}</div>
      <div>Clicks: {payload[0].value as number}</div>
    </div>
  );
}
