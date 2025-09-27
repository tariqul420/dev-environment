// app/calc/bmi/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useMemo, useState } from 'react';

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {desc ? <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{desc}</p> : null}
    </div>
  );
}

export default function BMIPage() {
  const [heightValue, setHeightValue] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [weightValue, setWeightValue] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  const parsed = useMemo(() => {
    const h = parseFloat(heightValue);
    const w = parseFloat(weightValue);
    if (!h || !w || h <= 0 || w <= 0) return null;

    const meters = heightUnit === 'cm' ? h / 100 : h * 0.0254;
    const kg = weightUnit === 'kg' ? w : w * 0.45359237;
    const bmi = kg / (meters * meters);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Healthy';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const minKg = 18.5 * meters * meters;
    const maxKg = 24.9 * meters * meters;

    return { bmi, category, minKg, maxKg, meters };
  }, [heightValue, heightUnit, weightValue, weightUnit]);

  const pretty = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '-');

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <SectionHeader title="BMI Calculator" desc="Calculate your Body Mass Index with metric or imperial units. Dark‑mode friendly UI with ShadCN components." />

      <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border-muted/40">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>Enter your height and weight, then see your BMI and healthy weight range.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-3">
              <Label className="text-sm">Height</Label>
              <div className="flex items-center gap-2">
                <Input inputMode="decimal" placeholder="e.g., 170" value={heightValue} onChange={(e) => setHeightValue(e.target.value)} />
                <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as any)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="in">inch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-sm">Weight</Label>
              <div className="flex items-center gap-2">
                <Input inputMode="decimal" placeholder="e.g., 65" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} />
                <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as any)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="BMI" value={parsed ? pretty(parsed.bmi, 1) : '—'} />
            <Stat label="Category" value={parsed ? parsed.category : '—'} />
            <Stat label="Healthy Range" value={parsed ? `${pretty(parsed.minKg, 1)}–${pretty(parsed.maxKg, 1)} kg` : '—'} />
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <p>* Categories based on WHO: Underweight (&lt;18.5), Healthy (18.5–24.9), Overweight (25–29.9), Obese (≥30).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

// -------------------------------------------------------------
// app/calc/unit-converter/page.tsx
('use client');

const CATEGORIES = ['Length', 'Weight', 'Temperature'] as const;

type Category = (typeof CATEGORIES)[number];

const UNITS: Record<Category, string[]> = {
  Length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
  Weight: ['kg', 'g', 'lb', 'oz'],
  Temperature: ['C', 'F', 'K'],
};

function toBase(category: Category, value: number, unit: string): number {
  switch (category) {
    case 'Length': {
      const map: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.344,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254,
      };
      return value * map[unit]; // base: meter
    }
    case 'Weight': {
      const map: Record<string, number> = {
        kg: 1,
        g: 0.001,
        lb: 0.45359237,
        oz: 0.028349523125,
      };
      return value * map[unit]; // base: kilogram
    }
    case 'Temperature': {
      // base: Celsius
      if (unit === 'C') return value;
      if (unit === 'F') return (value - 32) * (5 / 9);
      if (unit === 'K') return value - 273.15;
      return value;
    }
  }
}

function fromBase(category: Category, baseValue: number, unit: string): number {
  switch (category) {
    case 'Length': {
      const map: Record<string, number> = {
        m: 1,
        km: 1 / 1000,
        cm: 100,
        mm: 1000,
        mi: 1 / 1609.344,
        yd: 1 / 0.9144,
        ft: 1 / 0.3048,
        in: 1 / 0.0254,
      };
      return baseValue * map[unit];
    }
    case 'Weight': {
      const map: Record<string, number> = {
        kg: 1,
        g: 1000,
        lb: 1 / 0.45359237,
        oz: 1 / 0.028349523125,
      };
      return baseValue * map[unit];
    }
    case 'Temperature': {
      if (unit === 'C') return baseValue;
      if (unit === 'F') return baseValue * (9 / 5) + 32;
      if (unit === 'K') return baseValue + 273.15;
      return baseValue;
    }
  }
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('Length');
  const [fromUnit, setFromUnit] = useState<string>(UNITS['Length'][0]);
  const [toUnit, setToUnit] = useState<string>(UNITS['Length'][1]);
  const [amount, setAmount] = useState<string>('1');

  const result = useMemo(() => {
    const num = parseFloat(amount);
    if (!Number.isFinite(num)) return null;
    const base = toBase(category, num, fromUnit);
    return fromBase(category, base, toUnit);
  }, [category, fromUnit, toUnit, amount]);

  // Ensure unit selections reset when category changes
  const handleCategory = (v: Category) => {
    setCategory(v);
    setFromUnit(UNITS[v][0]);
    setToUnit(UNITS[v][1] ?? UNITS[v][0]);
  };

  const pretty = (n: number | null) => (n == null ? '—' : new Intl.NumberFormat().format(n));

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <SectionHeader title="Unit Converter" desc="Convert between common length, weight, and temperature units. Built with ShadCN UI." />

      <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border-muted/40">
        <CardHeader>
          <CardTitle>Conversion</CardTitle>
          <CardDescription>Select a category, units, and amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => handleCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>From</Label>
                <div className="flex items-center gap-2">
                  <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS[category].map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS[category].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border bg-card p-6">
                <div className="text-sm text-muted-foreground">Result</div>
                <div className="mt-2 text-3xl font-semibold">
                  {pretty(result)} {toUnit}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Base units: meters, kilograms, and Celsius.</p>
              </div>

              <div className="rounded-xl border bg-card p-4 text-xs text-muted-foreground">
                <p>Temperature uses exact conversion formulas. Length & weight use SI factors.</p>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-xs text-muted-foreground">Tip: Press Tab to quickly move between fields.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// -------------------------------------------------------------
// app/calc/date-diff/page.tsx
('use client');

function diffYMD(a: Date, b: Date) {
  // Compute calendar diff in years, months, days
  let from = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  let to = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  if (to < from) [from, to] = [to, from];

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    // borrow from previous month
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <SectionHeader title="Date Difference Calculator" desc="Find the exact time between two dates in years, months, days — plus totals in weeks, hours, minutes, and seconds." />

      <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border-muted/40">
        <CardHeader>
          <CardTitle>Pick dates</CardTitle>
          <CardDescription>Uses your local timezone for calculations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div className="grid gap-2">
              <Label>Start date</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="flex items-end justify-center">
              <Button variant="outline" className="mt-2 md:mt-0" onClick={swap}>
                Swap
              </Button>
            </div>
            <div className="grid gap-2">
              <Label>End date</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Calendar diff" value={out ? `${out.years}y ${out.months}m ${out.days}d` : '—'} />
            <Stat label="Total days" value={out ? String(out.totalDays) : '—'} />
            <Stat label="Total weeks" value={out ? String(out.totalWeeks) : '—'} />
            <Stat label="Total hours" value={out ? String(out.totalHours) : '—'} />
            <Stat label="Total minutes" value={out ? String(out.totalMinutes) : '—'} />
            <Stat label="Total seconds" value={out ? String(out.totalSeconds) : '—'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reuse SectionHeader & Stat components from BMI page in this file scope
