'use client';

import { CalcButton } from '@/components/calculators/calc-button';
import { Display } from '@/components/calculators/display';
import SectionHeader from '@/components/root/section-header';
import { MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { safeEval } from '@/lib/safe-eval';
import { Equal, Eraser, Parentheses, Pi, Square, Superscript } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const FNS = [
  { label: 'sin', ins: 'sin(' },
  { label: 'cos', ins: 'cos(' },
  { label: 'tan', ins: 'tan(' },
  { label: 'log', ins: 'log(' },
  { label: 'ln', ins: 'ln(' },
  { label: '√', ins: '√(' },
];

export default function ScientificCalculatorPage() {
  const [expr, setExpr] = useState('');
  const [ans, setAns] = useState<string>('');

  useEffect(() => {
    const v = safeEval(expr);
    setAns(v == null ? '' : String(v));
  }, [expr]);

  const push = (t: string) => setExpr((e) => e + t);
  const clear = () => {
    setExpr('');
    setAns('');
  };
  const back = () => setExpr((e) => e.slice(0, -1));
  const equal = () => {
    const v = safeEval(expr);
    if (v == null) return;
    setExpr(String(v));
    setAns('');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <SectionHeader title="Scientific Calculator" desc="Trig, logs, powers, roots and constants with a glass UI." />

      <MotionGlassCard className="p-4">
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-6">
          <Display value={expr || '0'} hint={ans ? `= ${ans}` : ''} />

          {/* function row */}
          {FNS.map((f) => (
            <CalcButton key={f.label} onClick={() => push(f.ins)} variantIntent="accent" className="hidden lg:flex">
              {f.label === '√' ? <Square className="h-4 w-4" /> : f.label}
            </CalcButton>
          ))}

          <CalcButton onClick={() => push('(')} variantIntent="ghost">
            <Parentheses className="h-4 w-4" />
          </CalcButton>
          <CalcButton onClick={() => push(')')} variantIntent="ghost">
            )
          </CalcButton>
          <CalcButton onClick={() => push('π')} variantIntent="ghost">
            <Pi className="h-4 w-4" />
          </CalcButton>
          <CalcButton onClick={() => push('e')} variantIntent="ghost">
            e
          </CalcButton>
          <CalcButton onClick={() => push('^')} variantIntent="ghost">
            <Superscript className="h-4 w-4" />
          </CalcButton>
          <CalcButton onClick={() => push('%')} variantIntent="ghost">
            %
          </CalcButton>

          {/* numbers and ops */}
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.'].map((t, i) => (
            <CalcButton key={i} onClick={() => push(t)} variantIntent={['/', '*', '-'].includes(t) ? 'accent' : 'ghost'}>
              {t}
            </CalcButton>
          ))}
          <CalcButton onClick={() => push('+')} variantIntent="accent">
            +
          </CalcButton>

          <CalcButton onClick={clear} variantIntent="danger" className="col-span-2 lg:col-span-3">
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </CalcButton>
          <CalcButton onClick={equal} variantIntent="primary" className="col-span-2 lg:col-span-3">
            <Equal className="mr-2 h-4 w-4" />
            Equals
          </CalcButton>
        </div>

        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground">Functions available: sin, cos, tan, log (base 10), ln (natural log), √ (square root), power (^), constants π and e. Use parentheses to group.</p>
      </MotionGlassCard>
    </div>
  );
}

// =============================
// (Optional) app/tools/calc/percentage/page.tsx – quick utility
// =============================
('use client');

export default function PercentageCalculatorPage() {
  const [part, setPart] = useState('');
  const [whole, setWhole] = useState('');
  const [percent, setPercent] = useState('');

  const result = useMemo(() => {
    const p = parseFloat(part);
    const w = parseFloat(whole);
    const r = parseFloat(percent);
    return {
      of: Number.isFinite(w) && Number.isFinite(r) ? (w * r) / 100 : null,
      percent: Number.isFinite(p) && Number.isFinite(w) && w !== 0 ? (p / w) * 100 : null,
    };
  }, [part, whole, percent]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <SectionHeader title="Percentage Calculator" desc="Find percentages fast (what is X% of Y, and X is what % of Y)." />
      <MotionGlassCard className="p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>X is what % of Y?</Label>
            <div className="flex gap-2">
              <Input inputMode="decimal" placeholder="X" value={part} onChange={(e) => setPart(e.target.value)} />
              <Input inputMode="decimal" placeholder="Y" value={whole} onChange={(e) => setWhole(e.target.value)} />
            </div>
            <div className="text-sm text-muted-foreground">Result: {Number.isFinite(result.percent as number) ? `${(result.percent as number).toFixed(2)}%` : '—'}</div>
          </div>

          <div className="grid gap-2">
            <Label>What is R% of Y?</Label>
            <div className="flex gap-2">
              <Input inputMode="decimal" placeholder="R%" value={percent} onChange={(e) => setPercent(e.target.value)} />
              <Input inputMode="decimal" placeholder="Y" value={whole} onChange={(e) => setWhole(e.target.value)} />
            </div>
            <div className="text-sm text-muted-foreground">Result: {Number.isFinite(result.of as number) ? (result.of as number).toFixed(2) : '—'}</div>
          </div>
        </div>
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground">Tip: Fill any two inputs to compute the third scenario.</p>
      </MotionGlassCard>
    </div>
  );
}
