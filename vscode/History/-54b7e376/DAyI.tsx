'use client';

import SectionHeader from '@/components/root/section-header';
import Stat from '@/components/root/stat';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftRight } from 'lucide-react';
import { useMemo, useState } from 'react';

function diffYMD(a: Date, b: Date) {
  // Compute calendar diff in years, months, days
  let from = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  let to = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  if (to < from) [from, to] = [to, from];

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const ms = Math.abs(b.getTime() - a.getTime());
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const totalSeconds = Math.floor(ms / 1000);
  return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds };
}

const fmtISODate = (d: Date) => {
  // returns yyyy-mm-dd in local timezone
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

export default function DateDiffPage() {
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');

  const out = useMemo(() => {
    if (!start || !end) return null;
    const a = new Date(start);
    const b = new Date(end);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    return diffYMD(a, b);
  }, [start, end]);

  const swap = () => {
    setStart((s) => {
      const t = end;
      setEnd(s);
      return t;
    });
  };

  const setTodayStart = () => setStart(fmtISODate(new Date()));
  const setTodayEnd = () => setEnd(fmtISODate(new Date()));
  const clearAll = () => {
    setStart('');
    setEnd('');
  };

  return (
    <div className="container mx-auto py-10">
      <SectionHeader title="Date Difference Calculator" desc="Find the exact time between two dates in years, months, and days — plus totals in weeks, hours, minutes, and seconds." />

      <MotionGlassCard>
        <CardHeader>
          <CardTitle>Pick dates</CardTitle>
          <CardDescription>Uses your local timezone for calculations.</CardDescription>
        </CardHeader>

        <div className="px-6 pb-6">
          {/* Inputs */}
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <GlassCard className="p-4">
              <div className="grid gap-2">
                <Label>Start date</Label>
                <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="bg-background/60 backdrop-blur" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={setTodayStart}>
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setStart('')}>
                    Clear
                  </Button>
                </div>
              </div>
            </GlassCard>

            <div className="flex items-end justify-center">
              <Button variant="outline" size="icon" className="mt-4 md:mt-0" onClick={swap}>
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <GlassCard className="p-4">
              <div className="grid gap-2">
                <Label>End date</Label>
                <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-background/60 backdrop-blur" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={setTodayEnd}>
                    Today
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEnd('')}>
                    Clear
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" onClick={clearAll}>
              Reset
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <GlassCard className="p-4">
              <Stat label="Calendar diff" value={out ? `${out.years}y ${out.months}m ${out.days}d` : '—'} />
            </GlassCard>
            <GlassCard className="p-4">
              <Stat label="Total days" value={out ? String(out.totalDays) : '—'} />
            </GlassCard>
            <GlassCard className="p-4">
              <Stat label="Total weeks" value={out ? String(out.totalWeeks) : '—'} />
            </GlassCard>
            <GlassCard className="p-4">
              <Stat label="Total hours" value={out ? String(out.totalHours) : '—'} />
            </GlassCard>
            <GlassCard className="p-4">
              <Stat label="Total minutes" value={out ? String(out.totalMinutes) : '—'} />
            </GlassCard>
            <GlassCard className="p-4">
              <Stat label="Total seconds" value={out ? String(out.totalSeconds) : '—'} />
            </GlassCard>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Tip: Click <span className="font-medium">Today</span> to quickly set either side to the current date, or use <span className="font-medium">Swap</span> to flip them.
          </div>
        </div>
      </MotionGlassCard>
    </div>
  );
}
