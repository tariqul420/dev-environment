"use client";

import {
  Calculator,
  Copy,
  Download,
  Hash,
  Info,
  RefreshCw,
  RotateCcw,
  Settings2,
} from "lucide-react";
import React from "react";
import {
  ActionButton,
  CopyButton,
  ExportTextButton,
  ResetButton,
} from "@/components/shared/action-buttons";
import { InputField } from "@/components/shared/form-fields/input-field";
import { SelectField } from "@/components/shared/form-fields/select-field";
import { SwitchRow } from "@/components/shared/form-fields/switch-row";
import { TextareaField } from "@/components/shared/form-fields/textarea-field";
// Reusable building blocks (as in your other tools)
import { ToolPageHeader } from "@/components/shared/tool-page-header";
import { Badge } from "@/components/ui/badge";
import { GlassCard, MotionGlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Base converter (supports bases 2–36, negatives, fractional part).
 * - Integer part uses BigInt (exact).
 * - Fraction is handled as rational using BigInt numerator/denominator –
 *   converted to any target base with configurable precision.
 * ---------------------------------------------------------------------------*/

type ResultRow = { base: number; label: string; value: string };

// digit ↔ value maps
const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const DIGIT_VAL: Record<string, number> = Object.fromEntries(
  Array.from(DIGITS).map((c, i) => [c, i]),
);

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function stripPrefix(raw: string) {
  let s = raw.trim();
  const sign = s.startsWith("-") ? "-" : s.startsWith("+") ? "+" : "";
  if (sign) s = s.slice(1);

  let baseFromPrefix: number | undefined;
  if (/^0b/i.test(s)) {
    baseFromPrefix = 2;
    s = s.slice(2);
  } else if (/^0o/i.test(s)) {
    baseFromPrefix = 8;
    s = s.slice(2);
  } else if (/^0x/i.test(s)) {
    baseFromPrefix = 16;
    s = s.slice(2);
  }
  return { sign, body: s, baseFromPrefix };
}

function charToVal(ch: string) {
  const v = DIGIT_VAL[ch.toLowerCase()];
  return v ?? -1;
}

function sanitizeBody(body: string) {
  // allow underscores/spaces as visual separators; drop them
  return body.replace(/[_\s]/g, "");
}

function parseToRational(
  input: string,
  base: number,
): { sign: 1n | -1n; int: bigint; fracNum: bigint; fracDen: bigint } {
  const s = sanitizeBody(input);
  const sign: 1n | -1n = s.startsWith("-") ? -1n : 1n;
  const clean = s.startsWith("-") || s.startsWith("+") ? s.slice(1) : s;

  const [intStr, fracStr = ""] = clean.split(".");
  const B = BigInt(base);

  // integer
  let int = 0n;
  for (const ch of intStr) {
    const v = charToVal(ch);
    if (v < 0 || v >= base) throw new Error(`Invalid digit "${ch}" for base ${base}.`);
    int = int * B + BigInt(v);
  }

  // fraction → numerator/denominator over B^n
  let num = 0n;
  let den = 1n;
  if (fracStr.length) {
    den = B ** BigInt(fracStr.length);
    for (const ch of fracStr) {
      const v = charToVal(ch);
      if (v < 0 || v >= base) throw new Error(`Invalid digit "${ch}" for base ${base}.`);
      num = num * B + BigInt(v);
    }
  }

  return { sign, int, fracNum: num, fracDen: den };
}

function toBaseString(
  sign: 1n | -1n,
  int: bigint,
  fracNum: bigint,
  fracDen: bigint,
  targetBase: number,
  precision: number,
  options: {
    uppercase: boolean;
    showPrefix: boolean;
    groupSize?: number;
  },
): string {
  const T = BigInt(targetBase);

  // integer digits (BigInt div)
  const toDigit = (n: number) => (options.uppercase ? DIGITS[n].toUpperCase() : DIGITS[n]);
  let n = int;
  const intDigits: string[] = [];
  if (n === 0n) intDigits.push("0");
  while (n > 0n) {
    const d = Number(n % T);
    intDigits.push(toDigit(d));
    n = n / T;
  }
  intDigits.reverse();

  // fractional digits
  const fracDigits: string[] = [];
  let num = fracNum;
  for (let i = 0; i < precision && num !== 0n; i++) {
    num = num * T;
    const d = num / fracDen;
    num = num % fracDen;
    fracDigits.push(toDigit(Number(d)));
  }

  const prefix =
    options.showPrefix && (targetBase === 2 || targetBase === 8 || targetBase === 16)
      ? targetBase === 2
        ? "0b"
        : targetBase === 8
          ? "0o"
          : "0x"
      : "";

  let head = intDigits.join("");
  if (options.groupSize && options.groupSize > 0) {
    head = groupDigits(head, options.groupSize, " ");
  }

  const tail = fracDigits.length ? `.${fracDigits.join("")}` : "";
  const signStr = sign < 0n && (int !== 0n || fracNum !== 0n) ? "-" : "";
  return `${signStr}${prefix}${head}${tail}`;
}

function toDecimalString(
  sign: 1n | -1n,
  int: bigint,
  fracNum: bigint,
  fracDen: bigint,
  precision: number,
) {
  const intStr = int.toString();
  if (fracNum === 0n || precision <= 0) return (sign < 0n ? "-" : "") + intStr;

  const digits: string[] = [];
  let num = fracNum;
  for (let i = 0; i < precision && num !== 0n; i++) {
    num = num * 10n;
    const d = num / fracDen;
    num = num % fracDen;
    digits.push(d.toString());
  }
  // trim trailing zeros
  while (digits.length && digits[digits.length - 1] === "0") digits.pop();

  const signStr = sign < 0n && (int !== 0n || fracNum !== 0n) ? "-" : "";
  return digits.length ? `${signStr}${intStr}.${digits.join("")}` : `${signStr}${intStr}`;
}

function groupDigits(s: string, size: number, sep = " ") {
  if (s.length <= size) return s;
  const out: string[] = [];
  let i = s.length;
  while (i > 0) {
    const start = Math.max(0, i - size);
    out.push(s.slice(start, i));
    i = start;
  }
  return out.reverse().join(sep);
}

function detectBase(raw: string): number | undefined {
  const { baseFromPrefix } = stripPrefix(raw);
  return baseFromPrefix;
}

/* -----------------------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------------------*/

export default function BaseConverterPage() {
  // Inputs
  const [raw, setRaw] = React.useState<string>("");
  const [fromBase, setFromBase] = React.useState<number>(10);
  const [autoDetect, setAutoDetect] = React.useState<boolean>(true);

  // Output settings
  const [precision, setPrecision] = React.useState<number>(16);
  const [uppercase, setUppercase] = React.useState<boolean>(true);
  const [showPrefix, setShowPrefix] = React.useState<boolean>(true);
  const [grouping, setGrouping] = React.useState<boolean>(true);
  const [groupSize, setGroupSize] = React.useState<number>(4);

  // Extra target base
  const [customBase, setCustomBase] = React.useState<number>(7);

  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  // compute
  const results = React.useMemo<ResultRow[]>(() => {
    setError(null);
    if (!raw.trim()) return [];

    try {
      const { sign, body, baseFromPrefix } = stripPrefix(raw);
      const base = autoDetect && baseFromPrefix ? baseFromPrefix : fromBase;

      if (base < 2 || base > 36) throw new Error("Base must be between 2 and 36.");

      const { int, fracNum, fracDen } = parseToRational(`${sign}${body}`, base);

      const opts = {
        uppercase,
        showPrefix,
        groupSize: grouping ? groupSize : 0,
      };

      const core: ResultRow[] = [
        {
          base: 2,
          label: "Binary",
          value: toBaseString(sign, int, fracNum, fracDen, 2, precision, opts),
        },
        {
          base: 8,
          label: "Octal",
          value: toBaseString(sign, int, fracNum, fracDen, 8, precision, opts),
        },
        {
          base: 10,
          label: "Decimal",
          value: toDecimalString(sign, int, fracNum, fracDen, precision),
        },
        {
          base: 16,
          label: "Hex",
          value: toBaseString(sign, int, fracNum, fracDen, 16, precision, opts),
        },
      ];

      const extra =
        customBase && ![2, 8, 10, 16].includes(customBase)
          ? [
              {
                base: customBase,
                label: `Base ${customBase}`,
                value: toBaseString(sign, int, fracNum, fracDen, customBase, precision, opts),
              } as ResultRow,
            ]
          : [];

      return [...core, ...extra];
    } catch (e: any) {
      setError(e?.message || "Conversion failed.");
      return [];
    }
  }, [
    raw,
    fromBase,
    autoDetect,
    precision,
    uppercase,
    showPrefix,
    grouping,
    groupSize,
    customBase,
  ]);

  const exportPayload = React.useMemo(
    () => ({
      input: raw,
      fromBase: autoDetect ? (detectBase(raw) ?? fromBase) : fromBase,
      precision,
      uppercase,
      showPrefix,
      grouping,
      groupSize,
      generatedAt: new Date().toISOString(),
      results,
    }),
    [raw, fromBase, autoDetect, precision, uppercase, showPrefix, grouping, groupSize, results],
  );

  const copyOne = async (s: string) => {
    await navigator.clipboard.writeText(s);
    setCopied(s);
    setTimeout(() => setCopied(null), 900);
  };

  const resetAll = () => {
    setRaw("");
    setFromBase(10);
    setAutoDetect(true);
    setPrecision(16);
    setUppercase(true);
    setShowPrefix(true);
    setGrouping(true);
    setGroupSize(4);
    setCustomBase(7);
    setError(null);
  };

  return (
    <MotionGlassCard className="p-4 md:p-6 lg:p-8">
      <ToolPageHeader
        title="Number Base Converter"
        subtitle="Convert between binary, octal, decimal, hex — plus any base 2–36. Supports fractional values and prefixes."
        icon={<Calculator className="h-6 w-6" />}
        actions={
          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={RefreshCw}
              label="Normalize"
              onClick={() => setRaw((v) => v.trim())}
            />

            <ExportTextButton
              icon={Download}
              label="Export JSON"
              filename="base-converter.json"
              getText={() => JSON.stringify(exportPayload, null, 2)}
            />
            <ResetButton onClick={resetAll} />
          </div>
        }
      />

      {/* Input + Settings */}
      <GlassCard className="shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Input */}
          <div className="lg:col-span-2">
            <TextareaField
              id="input"
              label="Input number"
              placeholder="Examples: 255, 0xff, 0b1111_1111, -101.101, 7.2"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              autoGrow
              className="min-h-[120px]"
            />
            <div className="mt-2 grid grid-cols-2 gap-3">
              <SelectField
                id="from"
                label="From base"
                value={String(fromBase)}
                onValueChange={(v) => setFromBase(Number(v))}
                options={Array.from({ length: 35 }, (_, i) => ({
                  value: String(i + 2),
                  label: String(i + 2),
                }))}
                disabled={autoDetect && !!detectBase(raw)}
              />
              <SwitchRow
                label="Auto-detect base from prefix (0b / 0o / 0x)"
                checked={autoDetect}
                onCheckedChange={setAutoDetect}
              />
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-destructive">
                <Info className="mt-0.5 h-4 w-4" />
                <div className="text-sm">{error}</div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              <div className="text-sm font-medium">Options</div>
            </div>

            <div className="grid gap-2">
              <InputField
                id="precision"
                type="number"
                label="Fraction precision (digits)"
                min={0}
                max={64}
                value={String(precision)}
                onChange={(e) => setPrecision(clamp(Number(e.target.value) || 0, 0, 64))}
              />
              <SwitchRow
                label="Uppercase letters (A–F)"
                checked={uppercase}
                onCheckedChange={setUppercase}
              />
              <SwitchRow
                label="Show prefixes (0b / 0o / 0x)"
                checked={showPrefix}
                onCheckedChange={setShowPrefix}
              />
              <SwitchRow
                label="Group integer digits"
                checked={grouping}
                onCheckedChange={setGrouping}
              />
              <InputField
                id="groupSize"
                type="number"
                label="Group size"
                min={2}
                max={8}
                value={String(groupSize)}
                onChange={(e) => setGroupSize(clamp(Number(e.target.value) || 0, 0, 8))}
                disabled={!grouping}
              />
            </div>

            <Separator className="my-3" />

            <div className="grid gap-2">
              <SelectField
                id="extra"
                label="Extra target base"
                value={String(customBase)}
                onValueChange={(v) => setCustomBase(Number(v))}
                options={Array.from({ length: 35 }, (_, i) => ({
                  value: String(i + 2),
                  label: String(i + 2),
                }))}
              />
              <div className="text-xs text-muted-foreground">
                Besides the standard bases (2, 8, 10, 16), add one more target here.
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <Separator className="my-6" />

      {/* Results */}
      <GlassCard className="shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 p-3">
          {results.length === 0 ? (
            <div className="rounded-md border p-3 text-sm text-muted-foreground">
              Enter a number above to see conversions. Tips:
              <ul className="mt-1 list-disc pl-4">
                <li>
                  Use <code>0b</code>, <code>0o</code>, <code>0x</code> prefixes to auto-detect.
                </li>
                <li>
                  Underscores and spaces are ignored: <code>1111_0000</code>.
                </li>
                <li>
                  Fractions are supported: <code>101.101</code>, <code>0xA.F</code>.
                </li>
              </ul>
            </div>
          ) : (
            results.map((r) => (
              <ResultCard
                key={r.label}
                label={r.label}
                base={r.base}
                value={r.value}
                onCopy={() => copyOne(r.value)}
                copied={copied === r.value}
              />
            ))
          )}
        </div>
      </GlassCard>
    </MotionGlassCard>
  );
}

/* -----------------------------------------------------------------------------
 * UI bits
 * ---------------------------------------------------------------------------*/

function ResultCard({
  label,
  base,
  value,
  onCopy,
  copied,
}: {
  label: string;
  base: number;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm font-medium">{label}</div>
          <Badge variant="outline" className="text-[10px]">
            base {base}
          </Badge>
        </div>
        <CopyButton icon={Copy} disabled={!copied} label="Copy" onClick={onCopy} />
      </div>
      <div className="rounded-md border bg-muted/30 p-2">
        <code className="block max-h-[140px] overflow-auto break-words font-mono text-xs">
          {value}
        </code>
      </div>
    </div>
  );
}
