"use client";

import { Calculator, Copy, Download, Info, Percent, RotateCcw } from "lucide-react";
import * as React from "react";
import { ActionButton, CopyButton, ResetButton } from "@/components/shared/action-buttons";
import { InputField } from "@/components/shared/form-fields/input-field";
import SwitchRow from "@/components/shared/form-fields/switch-row";
import ToolPageHeader from "@/components/shared/tool-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function VatCalculatorPage() {
  // State
  const [mode, setMode] = React.useState<"add" | "remove">("add"); // add tax to net vs remove tax from gross
  const [price, setPrice] = React.useState<number>(1000);
  const [rate, setRate] = React.useState<number>(15); // %
  const [round2, setRound2] = React.useState<boolean>(true);
  const [currency, setCurrency] = React.useState<string>("BDT");
  const [copied, setCopied] = React.useState<"net" | "tax" | "gross" | null>(null);

  // Derived
  const r = Math.max(0, rate) / 100;
  const calc = React.useMemo(() => computeVat({ price, r, mode }), [price, r, mode]);

  function resetAll() {
    setMode("add");
    setPrice(1000);
    setRate(15);
    setRound2(true);
    setCurrency("BDT");
    setCopied(null);
  }

  function copy(val: number, which: "net" | "tax" | "gross") {
    navigator.clipboard.writeText(formatMoney(val, currency, round2));
    setCopied(which);
    setTimeout(() => setCopied(null), 1200);
  }

  function exportCSV() {
    const rows: string[][] = [
      ["Mode", "Input Price", "Rate %", "Net", "Tax", "Gross"],
      [
        mode === "add" ? "Add Tax" : "Remove Tax",
        numStr(price),
        String(rate),
        numStr(calc.net),
        numStr(calc.tax),
        numStr(calc.gross),
      ],
    ];
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vat-calculation.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Header */}
      <ToolPageHeader
        icon={Percent}
        title="GST/VAT Calculator"
        description="Add tax to a net price or remove tax from a gross price."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <ActionButton variant="default" icon={Calculator} label="Calculate" />
          </>
        }
      />

      {/* Inputs */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
          <CardDescription>
            Choose mode, set price and tax rate. Use quick chips for common rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <ModeButton active={mode === "add"} onClick={() => setMode("add")}>
                Add Tax
              </ModeButton>
              <ModeButton active={mode === "remove"} onClick={() => setMode("remove")}>
                Remove Tax
              </ModeButton>
            </div>
            <p className="text-xs text-muted-foreground">
              Add = price is net (pre‑tax). Remove = price is gross (tax‑inclusive).
            </p>
          </div>

          <div className="space-y-2">
            <InputField
              label={mode === "add" ? "Net Price" : "Gross Price"}
              id="price"
              inputMode="decimal"
              value={numDisplay(price)}
              onChange={(e) => setPrice(safeNum(e.target.value))}
            />

            <p className="text-xs text-muted-foreground">
              Enter the {mode === "add" ? "pre‑tax" : "tax‑inclusive"} amount.
            </p>
          </div>

          <div className="space-y-2">
            <InputField
              label="Tax Rate (%)"
              id="rate"
              type="number"
              min={0}
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {[5, 7.5, 10, 12, 15].map((v) => (
                <QuickChip key={v} onClick={() => setRate(v)}>
                  {v}%
                </QuickChip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <SwitchRow label="Round to 2 decimals" checked={round2} onCheckedChange={setRound2} />
            <div className="text-xs text-muted-foreground">
              Currency formatting defaults to your locale. Current: <strong>{currency}</strong>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["BDT", "USD", "INR", "EUR"].map((c) => (
                <QuickChip key={c} onClick={() => setCurrency(c)}>
                  {c}
                </QuickChip>
              ))}
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator />

      {/* Results */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
          <CardDescription>Calculated amounts based on your inputs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultBox
              label="Net"
              value={formatMoney(calc.net, currency, round2)}
              onCopy={() => copy(calc.net, "net")}
              copied={copied === "net"}
            />
            <ResultBox
              label="Tax"
              value={formatMoney(calc.tax, currency, round2)}
              onCopy={() => copy(calc.tax, "tax")}
              copied={copied === "tax"}
            />
            <ResultBox
              label="Gross"
              value={formatMoney(calc.gross, currency, round2)}
              onCopy={() => copy(calc.gross, "gross")}
              copied={copied === "gross"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Mode: {mode === "add" ? "Add Tax" : "Remove Tax"}</Badge>
            <Badge variant="outline">Rate: {rate}%</Badge>
            <Badge variant="outline">Currency: {currency}</Badge>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>
              Add Tax: gross = net × (1 + r). Remove Tax: net = gross ÷ (1 + r). Tax = gross − net.
            </span>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="gap-2" onClick={exportCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </GlassCard>
    </>
  );
}

// Components
function ModeButton({
  active,
  onClick,
  children,
}: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-sm transition",
        active ? "bg-primary/10 border-primary/40" : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {children}
    </button>
  );
}

function QuickChip({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition"
    >
      {children}
    </button>
  );
}

function ResultBox({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied?: boolean;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <CopyButton getText={() => onCopy} />
        <Button variant="outline" size="sm" className="gap-2" onClick={onCopy}>
          {copied ? <span>✔</span> : <Copy className="h-4 w-4" />} Copy
        </Button>
      </div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

// Logic
function computeVat({ price, r, mode }: { price: number; r: number; mode: "add" | "remove" }) {
  const p = Math.max(0, Number(price) || 0);
  const rate = Math.max(0, Number(r) || 0);
  let net = 0,
    gross = 0,
    tax = 0;

  if (mode === "add") {
    net = p;
    gross = p * (1 + rate);
    tax = gross - net;
  } else {
    gross = p;
    net = rate === 0 ? p : p / (1 + rate);
    tax = gross - net;
  }

  return { net, tax, gross };
}

// Utils
function numDisplay(n: number) {
  return Number.isFinite(n) ? String(n) : "";
}
function numStr(n: number) {
  return String(n);
}
function safeNum(v: string) {
  const x = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
}
function csvEscape(cell: string) {
  if (/[",\n]/.test(cell)) return '"' + cell.replace(/"/g, '""') + '"';
  return cell;
}
function formatMoney(n: number, currency: string, round2: boolean) {
  const val = round2 ? Math.round(n * 100) / 100 : n;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(val);
  } catch {
    return new Intl.NumberFormat().format(val) + " " + currency;
  }
}
