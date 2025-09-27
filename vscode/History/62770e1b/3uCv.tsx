'use client';

import { CalcButton } from '@/components/calculators/calc-button';
import { Display } from '@/components/calculators/display';
import SectionHeader from '@/components/root/section-header';
import { MotionGlassCard } from '@/components/ui/glass-card';
import { safeEval } from '@/lib/safe-eval';
import { Equal, Eraser, Parentheses, Pi, Square, Superscript } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      </MotionGlassCard>
    </div>
  );
}
