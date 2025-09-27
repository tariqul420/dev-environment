"use client";

import {
  Calculator,
  ClipboardPaste,
  Copy,
  Delete,
  Divide,
  Equal,
  Eraser,
  FunctionSquare,
  Percent,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";
import { CalcButton } from "@/components/calculators/calc-button";
import { Display } from "@/components/calculators/display";
import { ActionButton, LinkButton, ResetButton } from "@/components/shared/action-buttons";
import ToolPageHeader from "@/components/shared/tool-page-header";
import { Button } from "@/components/ui/button";
import { GlassCard, MotionGlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { safeEval } from "@/lib/safe-eval";

export default function StandardCalculatorClient() {
  const [expr, setExpr] = React.useState<string>("");
  const [ans, setAns] = React.useState<string>("");
  const [lastAns, setLastAns] = React.useState<string>("");

  const exprWithAns = React.useMemo(() => {
    if (!expr) return "";
    if (!lastAns) return expr;
    return expr.replace(/\bANS\b/g, lastAns);
  }, [expr, lastAns]);

  // Live preview
  React.useEffect(() => {
    const v = safeEval(exprWithAns);
    setAns(v == null ? "" : String(v));
  }, [exprWithAns]);

  const push = (t: string) => setExpr((e) => e + t);

  const clear = React.useCallback(() => {
    setExpr("");
    setAns("");
  }, []);

  const back = React.useCallback(() => {
    setExpr((e) => e.slice(0, -1));
  }, []);

  const equal = React.useCallback(() => {
    const v = safeEval(exprWithAns);
    if (v == null) return;
    const s = String(v);
    setExpr(s);
    setLastAns(s);
    setAns("");
  }, [exprWithAns]);

  const copyExpr = async () => {
    try {
      await navigator.clipboard.writeText(expr || "0");
      toast.success("Expression copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const copyAns = async () => {
    try {
      const v = ans || expr;
      if (!v) return;
      await navigator.clipboard.writeText(String(v));
      toast.success("Result copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const pasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      const sanitized = text.replace(/[^0-9.+\-*/()% ()A-Z]/gi, "");
      setExpr((e) => e + sanitized);
      toast.success("Pasted");
    } catch {
      toast.error("Paste failed");
    }
  };

  // stable key handler that references the stable handlers
  const onKey = React.useCallback(
    (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9.+\-*/()% ]$/.test(k)) {
        setExpr((x) => x + k);
      } else if (k === "Enter") {
        equal();
      } else if (k === "Backspace") {
        back();
      } else if (k.toLowerCase() === "c") {
        clear();
      }
    },
    [equal, back, clear],
  );

  // effect depends on the stable onKey
  React.useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <>
      <ToolPageHeader
        icon={Calculator}
        title="Standard Calculator"
        description="Type freely; preview updates live. Use ANS to reuse the last result."
        actions={
          <>
            <ResetButton onClick={clear} />
            <ActionButton icon={ClipboardPaste} label="Paste" onClick={pasteClipboard} />
            <ActionButton icon={Copy} label="Copy Expr" onClick={copyExpr} />
            <ActionButton
              icon={Copy}
              label="Copy Result"
              onClick={copyAns}
              disabled={!ans && !expr}
            />
          </>
        }
      />

      {/* Quick nav */}
      <GlassCard className="px-4 py-3">
        <div className="mb-1 flex flex-wrap gap-2">
          <LinkButton icon={Calculator} label="Standard" href="/tools/calc/standard" />
          <Link href="/tools/calc/standard">
            <Button variant="default" size="sm" className="gap-2">
              <Calculator className="h-4 w-4" />
              Standard
            </Button>
          </Link>
          <Link href="/tools/calc/scientific">
            <Button variant="outline" size="sm" className="gap-2">
              <FunctionSquare className="h-4 w-4" />
              Scientific
            </Button>
          </Link>
          <Link href="/tools/calc/percentage">
            <Button variant="outline" size="sm" className="gap-2">
              <Percent className="h-4 w-4" />
              Percentage
            </Button>
          </Link>
        </div>
      </GlassCard>

      <Separator className="my-4" />

      <MotionGlassCard className="space-y-4 p-4">
        {/* Flowing actions */}
        <GlassCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Keyboard: digits & operators, <span className="font-mono">Enter</span> (=),
            <span className="font-mono"> Backspace</span> (DEL),{" "}
            <span className="font-mono">C</span> (clear).
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton icon={RotateCcw} label="Reset" variant="outline" onClick={clear} />
            <ActionButton icon={Copy} label="Copy Expr" variant="outline" onClick={copyExpr} />
            <ActionButton
              icon={Copy}
              label="Copy Result"
              variant="outline"
              onClick={copyAns}
              disabled={!ans && !expr}
            />
            <ActionButton
              icon={ClipboardPaste}
              label="Paste"
              variant="outline"
              onClick={pasteClipboard}
            />
          </div>
        </GlassCard>

        {/* Calculator */}
        <div className="grid grid-cols-4 gap-3">
          {/* Display spans all columns */}
          <Display value={expr || "0"} hint={ans ? `= ${ans}` : ""} />

          {/* Top row */}
          <CalcButton
            onClick={clear}
            variantIntent="danger"
            className="col-span-2"
            title="All Clear (C)"
          >
            <Eraser className="mr-2 h-4 w-4" />
            AC
          </CalcButton>
          <CalcButton onClick={back} variantIntent="accent" title="Delete (Backspace)">
            <Delete className="mr-2 h-4 w-4" />
            DEL
          </CalcButton>
          <CalcButton onClick={() => push("/")} variantIntent="accent" title="Divide">
            <Divide className="h-4 w-4" />
          </CalcButton>

          {/* Digits & ops grid */}
          {["7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "(", ")"].map(
            (t) => (
              <CalcButton
                key={t}
                onClick={() => push(t)}
                variantIntent={["*", "-", "+"].includes(t) ? "accent" : "ghost"}
                title={t === "*" ? "Multiply" : t}
              >
                {t === "*" ? <X className="h-4 w-4" /> : t}
              </CalcButton>
            ),
          )}

          {/* Bottom row */}
          <CalcButton onClick={() => push("%")} variantIntent="ghost" title="Percent">
            %
          </CalcButton>
          <CalcButton
            onClick={() => push("ANS")}
            onDoubleClick={() => push(lastAns)}
            variantIntent="ghost"
            title="Insert ANS (double-click to insert numeric)"
          >
            ANS
          </CalcButton>
          <CalcButton
            className="col-span-2"
            variantIntent="primary"
            onClick={equal}
            title="Equals (Enter)"
          >
            <Equal className="mr-2 h-4 w-4" />
            Equals
          </CalcButton>
        </div>
      </MotionGlassCard>
    </>
  );
}
