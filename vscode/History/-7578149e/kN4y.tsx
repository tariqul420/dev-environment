'use client';

import { ActionButton, CopyButton, DownloadTextButton, PasteButton, ResetButton } from '@/components/shared/action-buttons';
import SelectField from '@/components/shared/form-fields/select-field';
import SwitchRow from '@/components/shared/form-fields/switch-row';
import ToolPageHeader from '@/components/shared/tool-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardType, Eraser, Upload, Wand2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Types
type HistoryItem = { id: string; ts: number; src: string; out: string };

// Helpers
function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function toTitleCase(s: string) {
  return s.replace(/[\w\p{L}][^\s-]*/gu, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function toSentenceCase(s: string) {
  return s.toLowerCase().replace(/(^\s*[a-z\p{Ll}]|[.!?]\s*[a-z\p{Ll}])/gu, (m) => m.toUpperCase());
}

function stripUrls(s: string) {
  const urlRe = /(https?:\/\/|www\.)[^\s]+/gi;
  return s.replace(urlRe, '');
}

function stripEmojis(s: string) {
  try {
    return s.replace(/\p{Extended_Pictographic}/gu, '');
  } catch {
    return s.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
  }
}

function normalizeSmartChars(s: string, opts: Pick<CleanOptions, 'normalizeQuotes' | 'normalizeDashes' | 'replaceEllipsis'>) {
  let r = s;
  if (opts.normalizeQuotes) {
    r = r
      .replace(/[\u2018\u2019\u2032]/g, "'")
      .replace(/[\u201C\u201D\u2033]/g, '"')
      .replace(/\u00AB|\u00BB/g, '"');
  }
  if (opts.normalizeDashes) {
    r = r.replace(/[\u2013\u2014]/g, '-');
  }
  if (opts.replaceEllipsis) {
    r = r.replace(/\u2026/g, '...');
  }
  return r;
}

function cleanText(input: string, opts: CleanOptions) {
  let s = input;

  // normalize NBSP & tabs
  s = s.replace(/\u00A0/g, ' ');
  if (opts.tabsToSpaces) s = s.replace(/\t/g, ' ');

  // normalize smart punctuation
  s = normalizeSmartChars(s, opts);

  // remove zero-width
  if (opts.removeZeroWidth) s = s.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // remove URLs
  if (opts.removeUrls) s = stripUrls(s);

  // remove emojis
  if (opts.removeEmojis) s = stripEmojis(s);

  // line-handling
  if (opts.stripLineBreaks) {
    s = s.replace(/[\r\n]+/g, ' ');
  } else if (opts.stripExtraBlankLines) {
    s = s.replace(/\n{3,}/g, '\n\n');
  }

  // spaces
  if (opts.collapseSpaces) s = s.replace(/[ \t]{2,}/g, ' ');
  if (opts.trim) s = s.trim();

  // case
  switch (opts.caseMode) {
    case 'lower':
      s = s.toLowerCase();
      break;
    case 'upper':
      s = s.toUpperCase();
      break;
    case 'title':
      s = toTitleCase(s);
      break;
    case 'sentence':
      s = toSentenceCase(s);
      break;
  }

  return s;
}

function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const DEFAULT_OPTS: CleanOptions = {
  trim: true,
  collapseSpaces: true,
  stripLineBreaks: false,
  stripExtraBlankLines: true,
  normalizeQuotes: true,
  normalizeDashes: true,
  replaceEllipsis: true,
  tabsToSpaces: true,
  removeZeroWidth: true,
  removeUrls: false,
  removeEmojis: false,
  caseMode: 'none',
  autoCleanOnPaste: true,
};

export default function ClipboardCleanerPage() {
  const [raw, setRaw] = useState('');
  const [opts, setOpts] = useState<CleanOptions>(DEFAULT_OPTS);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const rawRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem('tools:clipclean:opts');
      if (s) setOpts({ ...DEFAULT_OPTS, ...(JSON.parse(s) as CleanOptions) });
      const h = localStorage.getItem('tools:clipclean:history');
      if (h) setHistory(JSON.parse(h));
      const r = localStorage.getItem('tools:clipclean:raw');
      if (r) setRaw(r);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tools:clipclean:opts', JSON.stringify(opts));
    } catch {}
  }, [opts]);
  useEffect(() => {
    try {
      localStorage.setItem('tools:clipclean:history', JSON.stringify(history.slice(0, 20)));
    } catch {}
  }, [history]);
  useEffect(() => {
    try {
      localStorage.setItem('tools:clipclean:raw', raw);
    } catch {}
  }, [raw]);

  const cleaned = useMemo(() => cleanText(raw, opts), [raw, opts]);

  const paste = async () => {
    try {
      if (!navigator.clipboard?.readText) throw new Error('CLIP');
      const t = await navigator.clipboard.readText();
      setRaw(opts.autoCleanOnPaste ? cleanText(t, opts) : t);
    } catch {
      rawRef.current?.focus();
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cleaned);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      pushHistory(raw, cleaned);
    } catch {}
  };

  const pushHistory = (src: string, out: string) => {
    if (!out.trim()) return;
    setHistory((h) => [{ id: uid('h'), ts: Date.now(), src, out }, ...h].slice(0, 20));
  };

  const onCleanClick = () => {
    pushHistory(raw, cleaned);
  };

  const resetAll = () => {
    setRaw('');
    setOpts(DEFAULT_OPTS);
  };

  const importFile = async (f: File) => {
    const txt = await f.text();
    setRaw(txt);
  };

  const exportTxt = () => download('cleaned.txt', cleaned, 'text/plain');

  // stats
  const stats = useMemo(() => {
    const chars = cleaned.length;
    const words = cleaned.trim() ? cleaned.trim().split(/\s+/).length : 0;
    const lines = cleaned ? cleaned.split(/\r?\n/).length : 0;
    return { chars, words, lines };
  }, [cleaned]);

  return (
    <>
      <ToolPageHeader
        icon={ClipboardType}
        title="Clipboard Cleaner"
        description="Strip formatting and paste as plain text. Clean punctuation, spaces, emojis & more."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <PasteButton />
            <ActionButton Icon={Wand2} onClick={onCleanClick} label="Clean" />
            <CopyButton variant="default" getText={() => cleaned || ''} disabled={!cleaned} />
          </>
        }
      />

      {/* Settings */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
          <CardDescription>Choose how text should be cleaned.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <SelectField
            label="Case"
            value={opts.caseMode}
            onValueChange={(v) => setOpts({ ...opts, caseMode: (v as CleanOptions['caseMode']) ?? 'none' })}
            options={[
              { label: 'No change', value: 'none' },
              { label: 'lowercase', value: 'lower' },
              { label: 'UPPERCASE', value: 'upper' },
              { label: 'Title Case', value: 'title' },
              { label: 'Sentence case', value: 'sentence' },
            ]}
          />

          <div className="space-y-2">
            <Label>Whitespace & Behavior</Label>
            <div className="flex flex-col gap-2 text-sm">
              <SwitchRow checked={opts.trim} onCheckedChange={(v) => setOpts({ ...opts, trim: v })} label="Trim ends" />
              <SwitchRow checked={opts.collapseSpaces} onCheckedChange={(v) => setOpts({ ...opts, collapseSpaces: v })} label="Collapse multiple spaces" />
              <SwitchRow checked={opts.tabsToSpaces} onCheckedChange={(v) => setOpts({ ...opts, tabsToSpaces: v })} label="Tabs → spaces" />
              <SwitchRow checked={opts.stripLineBreaks} onCheckedChange={(v) => setOpts({ ...opts, stripLineBreaks: v })} label="Flatten line breaks" />
              <SwitchRow checked={opts.stripExtraBlankLines} onCheckedChange={(v) => setOpts({ ...opts, stripExtraBlankLines: v })} label="Keep max 1 blank line" />
              <SwitchRow checked={opts.autoCleanOnPaste} onCheckedChange={(v) => setOpts({ ...opts, autoCleanOnPaste: v })} label="Auto‑clean on paste" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Characters</Label>
            <div className="flex flex-col gap-2 text-sm">
              <SwitchRow checked={opts.normalizeQuotes} onCheckedChange={(v) => setOpts({ ...opts, normalizeQuotes: v })} label="Smart quotes → ' " />
              <SwitchRow checked={opts.normalizeDashes} onCheckedChange={(v) => setOpts({ ...opts, normalizeDashes: v })} label="En/Em dashes → -" />
              <SwitchRow checked={opts.replaceEllipsis} onCheckedChange={(v) => setOpts({ ...opts, replaceEllipsis: v })} label="Ellipsis … → ..." />
              <SwitchRow checked={opts.removeZeroWidth} onCheckedChange={(v) => setOpts({ ...opts, removeZeroWidth: v })} label="Remove zero‑width chars" />
              <SwitchRow checked={opts.removeEmojis} onCheckedChange={(v) => setOpts({ ...opts, removeEmojis: v })} label="Remove emojis" />
              <SwitchRow checked={opts.removeUrls} onCheckedChange={(v) => setOpts({ ...opts, removeUrls: v })} label="Remove URLs" />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator />

      {/* Editors */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Editor</CardTitle>
          <CardDescription>Paste on the left, get clean text on the right.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Original</Label>
              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="text/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importFile(f);
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                />
                <Button variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Load file
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setRaw('')}>
                  <Eraser className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
            <Textarea
              ref={rawRef}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onPaste={(e) => {
                if (!opts.autoCleanOnPaste) return;
                const pasted = e.clipboardData.getData('text');
                if (pasted) {
                  e.preventDefault();
                  const out = cleanText(pasted, opts);
                  const selStart = (e.target as HTMLTextAreaElement).selectionStart || 0;
                  const selEnd = (e.target as HTMLTextAreaElement).selectionEnd || 0;
                  setRaw((prev) => prev.slice(0, selStart) + out + prev.slice(selEnd));
                }
              }}
              placeholder="Paste here (Ctrl/Cmd + V)…"
              className="min-h-[220px] font-mono"
            />
            <div className="text-xs text-muted-foreground">Tip: Use the Paste button for one‑click clipboard import.</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cleaned</Label>
              <div className="flex gap-2">
                <DownloadTextButton variant="outline" filename="cleaned.txt" getText={() => cleaned} label="Export" disabled={!cleaned} />

                <CopyButton variant="default" getText={cleaned || ''} />
              </div>
            </div>
            <Textarea readOnly value={cleaned} className="min-h-[220px] font-mono" />
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{stats.words} words</Badge>
              <Badge variant="secondary">{stats.chars} chars</Badge>
              <Badge variant="secondary">{stats.lines} lines</Badge>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      {/* History */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
          <CardDescription>Last 20 results (local only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.length === 0 && <p className="text-sm text-muted-foreground">No history yet. Clean something to see it here.</p>}
          <div className="grid gap-3 md:grid-cols-2">
            {history.map((h) => (
              <div key={h.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(h.ts).toLocaleString()}</span>
                  <CopyButton variant="outline" size="sm" getText={() => h.out || ''} />
                </div>
                <div className="text-xs text-muted-foreground">Source</div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words bg-muted/30 rounded p-2 max-h-32">{h.src}</pre>
                <div className="text-xs text-muted-foreground">Cleaned</div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words bg-muted/30 rounded p-2 max-h-32">{h.out}</pre>
              </div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </>
  );
}
