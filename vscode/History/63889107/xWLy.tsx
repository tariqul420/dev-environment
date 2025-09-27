'use client';

import { ActionButton, CopyButton, ResetButton } from '@/components/shared/action-buttons';
import { InputField } from '@/components/shared/form-fields/input-field';
import SwitchRow from '@/components/shared/form-fields/switch-row';
import ToolPageHeader from '@/components/shared/tool-page-header';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CalendarDays, CalendarSearch, ChevronLeft, ChevronRight, Info, LucideProps } from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

const msDay = 24 * 60 * 60 * 1000;
const pad = (n: number, w = 2) => n.toString().padStart(w, '0');

function fmtDateInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromDateInput(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

// ISO weekday: Monday=1 ... Sunday=7
function isoWeekday(d: Date) {
  const wd = d.getDay();
  return wd === 0 ? 7 : wd;
}

function isoWeekInfo(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const week = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / msDay - ((firstThursday.getUTCDay() || 7) - 4)) / 7);
  return { isoYear, week };
}

function startOfISOWeek(date: Date) {
  const d = new Date(date);
  const diff = isoWeekday(d) - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfISOWeek(date: Date) {
  const d = new Date(date);
  const diff = 7 - isoWeekday(d);
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

function fromISOYearWeek(isoYear: number, week: number) {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4Dow = jan4.getUTCDay() || 7;
  const mondayW1 = new Date(jan4);
  mondayW1.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1));
  const monday = new Date(mondayW1.getTime() + (week - 1) * 7 * msDay);
  return new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
}

function fmtShort(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

export default function WeekNumberPage() {
  const [dateStr, setDateStr] = useState(() => fmtDateInput(new Date()));
  const [showUS, setShowUS] = useState(false);

  const date = useMemo(() => fromDateInput(dateStr), [dateStr]);
  const iso = useMemo(() => isoWeekInfo(date), [date]);
  const isoRange = useMemo(() => ({ start: startOfISOWeek(date), end: endOfISOWeek(date) }), [date]);

  const usWeek = useMemo(() => {
    if (!showUS) return null as null | { year: number; week: number };
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const offset = startOfYear.getDay();
    const daysSince = Math.floor((d.getTime() - startOfYear.getTime()) / msDay) + offset;
    const week = Math.floor(daysSince / 7) + 1;
    return { year: d.getFullYear(), week };
  }, [date, showUS]);

  const gotoDelta = (deltaWeeks: number) => setDateStr(fmtDateInput(new Date(date.getFullYear(), date.getMonth(), date.getDate() + deltaWeeks * 7)));
  const setToday = () => setDateStr(fmtDateInput(new Date()));

  const [copied, setCopied] = useState<'link' | 'summary' | ''>('');
  const copyLink = async () => {
    try {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams();
      params.set('date', dateStr);
      params.set('sys', showUS ? 'iso,us' : 'iso');
      const link = `${window.location.pathname}?${params.toString()}`;
      await navigator.clipboard?.writeText(window.location.origin + link);
      setCopied('link');
      setTimeout(() => setCopied(''), 1200);
    } catch {}
  };

  const copySummary = async () => {
    try {
      const s = `ISO Year ${iso.isoYear}, Week ${iso.week}\nRange: ${fmtShort(isoRange.start)} — ${fmtShort(isoRange.end)}` + (usWeek ? `\nUS Week: ${usWeek.year}-W${usWeek.week}` : '');
      await navigator.clipboard?.writeText(s);
      setCopied('summary');
      setTimeout(() => setCopied(''), 1200);
    } catch {}
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const d = p.get('date');
    const sys = p.get('sys');
    if (d) setDateStr(d);
    if (sys) setShowUS(sys.includes('us'));
  }, []);

  const weekDays = useMemo(() => {
    const list: { d: Date; label: string }[] = [];
    const start = isoRange.start;
    for (let i = 0; i < 7; i++) {
      const di = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      list.push({ d: di, label: fmtShort(di) });
    }
    return list;
  }, [isoRange]);

  const params = new URLSearchParams();
  params.set('date', dateStr);
  params.set('sys', showUS ? 'iso,us' : 'iso');
  const link = `${window.location.pathname}?${params.toString()}`;

  const summary = `ISO Year ${iso.isoYear}, Week ${iso.week}\nRange: ${fmtShort(isoRange.start)} — ${fmtShort(isoRange.end)}` + (usWeek ? `\nUS Week: ${usWeek.year}-W${usWeek.week}` : '');

  return (
    <>
      {/* Header */}
      <ToolPageHeader
        icon={CalendarSearch}
        title="Week Number"
        description="ISO-8601 weeks (Mon–Sun) with a glanceable range overview."
        actions={
          <>
            <ResetButton label="Week start" onClick={() => setDateStr(fmtDateInput(fromISOYearWeek(iso.isoYear, iso.week)))} />
            <CopyButton label="Copy summary" copiedLabel="Copied summary" getText={() => summary} />
            <CopyButton variant="default" label="Copy Link" copiedLabel="Copied Label" getText={() => link} />
          </>
        }
      />

      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Pick a Date</CardTitle>
          <CardDescription>Weeks start Monday; week 1 is the week with Jan 4.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <InputField id="wk-date" label="Date" type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
            <div className="flex flex-wrap gap-2 mt-2">
              <ActionButton variant="outline" Icon={ChevronLeft} label="Prev" size="sm" onClick={() => gotoDelta(-1)} />
              <ActionButton variant="outline" label="Today" size="sm" onClick={() => setToday()} />
              <ActionButton variant="outline" Icon={ChevronRight} label="Next" size="sm" onClick={() => gotoDelta(1)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Extras</Label>
            <SwitchRow label="Show US-style week number" checked={showUS} onCheckedChange={setShowUS} />
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <Info className="h-3.5 w-3.5" /> US week = Sun–Sat, week 1 starts Jan 1.
            </p>
          </div>
        </CardContent>
      </GlassCard>

      <Separator />

      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
          <CardDescription>ISO info and the Monday–Sunday range.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat title="ISO Year" value={iso.isoYear} icon={<CalendarSearch className="h-4 w-4" />} />
            <Stat title="ISO Week" value={`W${iso.week}`} icon={<CalendarSearch className="h-4 w-4" />} />
            <Stat title="Start (Mon)" value={fmtShort(isoRange.start)} icon={<CalendarDays className="h-4 w-4" />} />
            <Stat title="End (Sun)" value={fmtShort(isoRange.end)} icon={<CalendarDays className="h-4 w-4" />} />
          </div>

          {showUS && usWeek && (
            <div className="rounded-md border p-3">
              <div className="text-sm">
                <span className="text-muted-foreground">US Week:</span>{' '}
                <span className="font-medium">
                  {usWeek.year}-W{usWeek.week}
                </span>{' '}
                <Badge variant="secondary" className="ml-2">
                  Sun–Sat
                </Badge>
              </div>
            </div>
          )}

          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-7">
              {weekDays.map(({ d, label }) => {
                const isToday = d.toDateString() === new Date().toDateString();
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <div key={d.toISOString()} className={cn('relative px-3 py-3 text-sm border-t', isWeekend && 'bg-muted/30', isToday && 'bg-primary/5')}>
                    <span>{label}</span>
                    {isToday && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary/70" /> Today
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded bg-muted/60" /> Weekend
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </>
  );
}

function Stat({ title, value, Icon }: { title: string; value: React.ReactNode; Icon?: LucideProps }) {
  return (
    <div className="rounded-xl border p-3 hover:ring-1 hover:ring-primary/20 transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {Icon}
          <span>{title}</span>
        </div>
        <Badge variant="secondary">ISO</Badge>
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
