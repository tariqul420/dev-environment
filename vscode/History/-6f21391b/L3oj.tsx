'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { CopyButton, ResetButton } from '@/components/shared/action-buttons';
import { InputField } from '@/components/shared/form-fields/input-field';
import SelectField from '@/components/shared/form-fields/select-field';
import SwitchRow from '@/components/shared/form-fields/switch-row';
import TextareaField from '@/components/shared/form-fields/textarea-field';
import ToolPageHeader from '@/components/shared/tool-page-header';
import { Check, Copy, Eraser, List, Type, Wand2 as Wand } from 'lucide-react';
import toast from 'react-hot-toast';

/* ------------------------------ Types ------------------------------ */
type DelimiterChar = '-' | '_' | '';
type DelimiterKey = 'dash' | 'underscore' | 'none';
type Mode = 'single' | 'batch';

type Options = {
  delimiter: DelimiterChar;
  lowercase: boolean;
  trim: boolean;
  transliterate: boolean; // remove diacritics
  collapse: boolean; // collapse repeated delimiters
  preserveUnderscore: boolean;
  keepNumbers: boolean;
  maxLen: number; // 0 = unlimited
  stopwords: string[]; // words to drop before slugifying
  customMap: Record<string, string>; // user replacements before cleanup
};

const delimiterFromKey = (k: DelimiterKey): DelimiterChar => (k === 'dash' ? '-' : k === 'underscore' ? '_' : '');

/* --------------------------- Slugify Core --------------------------- */
function deburr(input: string) {
  // Remove diacritics using NFD + strip combining marks
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function applyCustomMap(text: string, map: Record<string, string>) {
  // Replace longer keys first to avoid partial overlaps
  const entries = Object.entries(map)
    .filter(([k]) => k.length > 0)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [from, to] of entries) {
    const re = new RegExp(escapeRegExp(from), 'g');
    text = text.replace(re, to);
  }
  return text;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenize(text: string) {
  // Split by any non letter/number/underscore characters
  return text.split(/[^A-Za-z0-9_]+/).filter(Boolean);
}

function removeStopwords(tokens: string[], stop: string[]) {
  if (!stop.length) return tokens;
  const set = new Set(stop.map((w) => w.toLowerCase().trim()).filter(Boolean));
  return tokens.filter((t) => !set.has(t.toLowerCase()));
}

function toWordsFromCamel(text: string) {
  // insert spaces before capitals/digits transitions (e.g., "HelloWorld99" -> "Hello World 99")
  return text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Za-z])(\d+)/g, '$1 $2');
}

function slugify(input: string, o: Options): string {
  let s = input ?? '';

  // Pre process
  s = toWordsFromCamel(s);
  s = applyCustomMap(s, o.customMap);
  if (o.transliterate) s = deburr(s);

  if (o.trim) s = s.trim();

  // Replace everything that's not alnum or underscore by space
  s = s.replace(/[^\p{Letter}\p{Number}_]+/gu, ' ');

  // Tokenize and optionally remove stopwords
  let tokens = tokenize(s);
  tokens = removeStopwords(tokens, o.stopwords);

  // Filter out pure-number tokens only if keepNumbers is false
  if (!o.keepNumbers) tokens = tokens.filter((t) => !/^\d+$/.test(t));

  // Join with delimiter
  let out = tokens.join(o.delimiter || '');

  // Collapse repeats of delimiter
  if (o.collapse && o.delimiter) {
    const re = new RegExp(`${escapeRegExp(o.delimiter)}{2,}`, 'g');
    out = out.replace(re, o.delimiter);
  }

  // Remove leading/trailing delimiter
  if (o.delimiter) out = out.replace(new RegExp(`^${escapeRegExp(o.delimiter)}|${escapeRegExp(o.delimiter)}$`, 'g'), '');

  if (o.lowercase) out = out.toLowerCase();

  // Max length (soft trim at delimiter boundary when possible)
  if (o.maxLen > 0 && out.length > o.maxLen) {
    if (o.delimiter && out.includes(o.delimiter)) {
      const parts = out.split(o.delimiter);
      let keep: string[] = [];
      let len = 0;
      for (const p of parts) {
        if ((len ? len + o.delimiter.length : 0) + p.length > o.maxLen) break;
        keep.push(p);
        len += (len ? o.delimiter.length : 0) + p.length;
      }
      out = keep.length ? keep.join(o.delimiter) : out.slice(0, o.maxLen);
    } else {
      out = out.slice(0, o.maxLen);
    }
  }

  // Underscore handling relative to chosen delimiter
  if (o.preserveUnderscore) {
    if (o.delimiter && o.delimiter !== '_') {
      out = out.replace(/_+/g, o.delimiter);
    }
  } else {
    if (o.delimiter && o.delimiter !== '_') {
      out = out.replace(/_+/g, o.delimiter);
    } else if (!o.delimiter) {
      out = out.replace(/_+/g, '');
    }
  }

  return out;
}

/* ----------------------------- Page UI ----------------------------- */

export default function SlugifyPage() {
  const [mode, setMode] = React.useState<Mode>('single');
  const [input, setInput] = React.useState<string>('');
  const [batchInput, setBatchInput] = React.useState<string>('');
  const [output, setOutput] = React.useState<string>('');
  const [batchOutput, setBatchOutput] = React.useState<string>('');
  const [copied, setCopied] = React.useState<'in' | 'out' | null>(null);

  const [delimiterKey, setDelimiterKey] = React.useState<DelimiterKey>('dash');
  const [lowercase, setLowercase] = React.useState(true);
  const [trim, setTrim] = React.useState(true);
  const [transliterate, setTransliterate] = React.useState(true);
  const [collapse, setCollapse] = React.useState(true);
  const [preserveUnderscore, setPreserveUnderscore] = React.useState(false);
  const [keepNumbers, setKeepNumbers] = React.useState(true);
  const [maxLen, setMaxLen] = React.useState<number>(0);
  const [stopwordText, setStopwordText] = React.useState<string>('a, an, the, and, or, of, for, with');
  const [customMapText, setCustomMapText] = React.useState<string>('™ =>\n& => and\n@ => at');

  const opts: Options = React.useMemo(
    () => ({
      delimiter: delimiterFromKey(delimiterKey),
      lowercase,
      trim,
      transliterate,
      collapse,
      preserveUnderscore,
      keepNumbers,
      maxLen,
      stopwords: parseStopwords(stopwordText),
      customMap: parseCustomMap(customMapText),
    }),
    [delimiterKey, lowercase, trim, transliterate, collapse, preserveUnderscore, keepNumbers, maxLen, stopwordText, customMapText],
  );

  const runSingle = React.useCallback(() => {
    setOutput(slugify(input, opts));
  }, [input, opts]);

  const runBatch = React.useCallback(() => {
    const lines = (batchInput || '').split(/\r?\n/);
    const slugs = lines.map((l) => slugify(l, opts));
    setBatchOutput(slugs.join('\n'));
  }, [batchInput, opts]);

  React.useEffect(() => {
    if (mode === 'single') runSingle();
  }, [mode, runSingle]);

  React.useEffect(() => {
    if (mode === 'batch') runBatch();
  }, [mode, runBatch]);

  const copyValue = async (kind: 'in' | 'out') => {
    const val = kind === 'in' ? (mode === 'single' ? input : batchInput) : mode === 'single' ? output : batchOutput;
    try {
      await navigator.clipboard.writeText(val);
      setCopied(kind);
      setTimeout(() => setCopied(null), 900);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed');
    }
  };

  const resetAll = () => {
    setInput('');
    setBatchInput('');
    setOutput('');
    setBatchOutput('');
    setDelimiterKey('dash');
    setLowercase(true);
    setTrim(true);
    setTransliterate(true);
    setCollapse(true);
    setPreserveUnderscore(false);
    setKeepNumbers(true);
    setMaxLen(0);
    setStopwordText('a, an, the, and, or, of, for, with');
    setCustomMapText('™ =>\n& => and\n@ => at');
  };

  const applyPreset = (key: 'seo' | 'github' | 'id' | 'raw') => {
    if (key === 'seo') {
      setDelimiterKey('dash');
      setLowercase(true);
      setTransliterate(true);
      setCollapse(true);
      setMaxLen(80);
    } else if (key === 'github') {
      setDelimiterKey('dash');
      setLowercase(true);
      setTransliterate(true);
      setCollapse(true);
      setPreserveUnderscore(false);
      setMaxLen(100);
    } else if (key === 'id') {
      setDelimiterKey('none');
      setLowercase(true);
      setTransliterate(true);
      setCollapse(true);
      setKeepNumbers(true);
      setMaxLen(32);
    } else {
      // raw: minimal processing
      setDelimiterKey('dash');
      setLowercase(false);
      setTransliterate(false);
      setCollapse(true);
      setMaxLen(0);
    }
  };

  return (
    <>
      {/* Header */}
      <ToolPageHeader icon={Type} title="Slugify" description="Convert titles and phrases into clean, URL-safe slugs." />

      {/* Presets + Controls */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => applyPreset('seo')}>
              SEO Blog
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset('github')}>
              GitHub Anchor
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset('id')}>
              Compact ID
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyPreset('raw')}>
              Raw
            </Button>
            <ResetButton className="ml-auto" onClick={resetAll} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SelectField
              label="Delimiter"
              placeholder="Choose"
              defaultValue="dash"
              value={delimiterKey}
              onValueChange={(v) => setDelimiterKey(v as DelimiterKey)}
              options={[
                { label: 'Dash (-)', value: 'dash' },
                { label: 'Underscore (_)', value: 'underscore' },
                { label: 'None (concat)', value: 'none' },
              ]}
            />

            <InputField id="maxLen" label="Max length (0 = off)" type="number" min={0} max={200} value={maxLen || ''} onChange={(e) => setMaxLen(Math.max(0, Number(e.target.value) || 0))} />

            <div className="grid grid-cols-2 gap-3">
              <SwitchRow label="Lowercase" checked={lowercase} onChange={setLowercase} />
              <SwitchRow label="Trim edges" checked={trim} onChange={setTrim} />
              <SwitchRow label="Transliterate" hint="Remove accents/diacritics" checked={transliterate} onChange={setTransliterate} />
              <SwitchRow label="Collapse repeats" checked={collapse} onChange={setCollapse} />
              <SwitchRow label="Keep numbers" checked={keepNumbers} onChange={setKeepNumbers} />
              <SwitchRow label="Preserve _" checked={preserveUnderscore} onChange={setPreserveUnderscore} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="grid gap-4">
            <InputField label="Stopwords (comma-separated)" value={stopwordText} onChange={(e) => setStopwordText(e.target.value)} placeholder="a, an, the, and…" />

            <TextareaField
              label="Custom replacements (one per line, “from - to”)"
              className="min-h-[190px]"
              value={customMapText}
              onValueChange={setCustomMapText}
              placeholder={`™ => \n& => and\n@ => at`}
              autoResize
              trimOnBlur
            />
          </div>
        </GlassCard>
      </div>

      <Separator />

      {/* Tabs: Single / Batch */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="gap-2">
            <Type className="h-4 w-4" /> Single
          </TabsTrigger>
          <TabsTrigger value="batch" className="gap-2">
            <List className="h-4 w-4" /> Batch
          </TabsTrigger>
        </TabsList>

        {/* Single */}
        <TabsContent value="single">
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Input</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setInput('')}>
                    <Eraser className="h-4 w-4" /> Clear
                  </Button>
                  <CopyButton variant="ghost" getText={() => (mode === 'single' ? input : batchInput)} />
                </div>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    setOutput(slugify(input, opts));
                  }
                }}
                placeholder="Write a title to slugify…  (Ctrl/Cmd + Enter to run)"
                className="min-h-[160px]"
              />
              <div className="flex flex-wrap gap-2">
                <Button className="gap-2" onClick={() => setOutput(slugify(input, opts))}>
                  <Wand className="h-4 w-4" /> Slugify
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Output</Label>
                <CopyButton variant="ghost" getText={() => (mode === 'single' ? output : batchOutput)} />
              </div>
              <TextareaField readOnly value={output} placeholder="Result will appear here…" />

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Length: <code className="rounded bg-muted px-1">{output.length}</code>
                </span>
                <span>
                  Delimiter:{' '}
                  <code className="rounded bg-muted px-1">
                    {(() => {
                      const d = delimiterFromKey(delimiterKey);
                      return d || '(none)';
                    })()}
                  </code>
                </span>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Batch */}
        <TabsContent value="batch" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Input (one title per line)</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setBatchInput('')}>
                    <Eraser className="h-4 w-4" /> Clear
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => copyValue('in')}>
                    {copied === 'in' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === 'in' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <Textarea value={batchInput} onChange={(e) => setBatchInput(e.target.value)} placeholder="My First Post\n10 Tips for SEO\nবাংলা শিরোনামও সমর্থিত" className="mt-2 min-h-[220px]" />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button className="gap-2" onClick={runBatch}>
                  <Wand className="h-4 w-4" /> Slugify List
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Output (one slug per line)</Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => copyValue('out')}>
                    {copied === 'out' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === 'out' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
              <Textarea readOnly value={batchOutput} placeholder="result-one\nresult-two\nresult-three" className="mt-2 min-h-[220px] font-mono" />
              <div className="mt-3 text-xs text-muted-foreground">
                Lines: <code className="rounded bg-muted px-1">{batchOutput ? batchOutput.split('\n').length : 0}</code>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

/* ------------------------------ Parsers ------------------------------ */

function parseStopwords(text: string): string[] {
  return text
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
}

function parseCustomMap(text: string): Record<string, string> {
  // Lines like: "™ =>" or "& => and"
  const map: Record<string, string> = {};
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^(.*?)(?:\s*=>\s*)(.*)$/);
    if (!m) continue;
    const from = (m[1] ?? '').trim();
    const to = (m[2] ?? '').trim();
    if (from.length) map[from] = to;
  }
  return map;
}
