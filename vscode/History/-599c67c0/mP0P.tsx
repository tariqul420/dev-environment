'use client';

import { DownloadTextButton, ImportFileButton, ResetButton } from '@/components/shared/action-buttons';
import ToolPageHeader from '@/components/shared/tool-page-header';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';

import SelectField from '@/components/shared/form-fields/select-field';
import SwitchRow from '@/components/shared/form-fields/switch-row';
import TextareaField from '@/components/shared/form-fields/textarea-field';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eraser, FileText, Sparkles, Type } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

/* Helpers */
const LS_KEY = 'text-cleaner-input-v1';

function normalizeEOL(s: string) {
  return s.replace(/\r\n?/g, '\n');
}
function countWords(s: string) {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}
function stripHtmlTags(s: string) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '');
}
function decodeHtmlEntities(html: string) {
  if (!html) return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
function smartQuotesToStraight(s: string) {
  return s
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2026]/g, '...')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022]/g, '-');
}
function removeEmojis(s: string) {
  return s.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '');
}
function removeUrls(s: string) {
  return s.replace(/\b(?:https?:\/\/|www\.)\S+/gi, '');
}
function removeEmails(s: string) {
  return s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '');
}
function removePunctuation(s: string) {
  return s.replace(/[^\p{L}\p{N}\s]/gu, '');
}
function removeDiacritics(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function keepAsciiOnly(s: string) {
  return s.replace(/[^\x00-\x7F]+/g, '');
}
function collapseSpaces(s: string) {
  return s.replace(/[ \t]+/g, ' ');
}
function collapseNewlines(s: string) {
  return s.replace(/\n{2,}/g, '\n');
}
function trimEachLine(s: string) {
  return normalizeEOL(s)
    .split('\n')
    .map((l) => l.trim())
    .join('\n');
}
function removeEmptyLines(s: string) {
  return normalizeEOL(s)
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .join('\n');
}
function toSentenceCase(s: string) {
  const lower = s.toLowerCase();
  const parts = lower.split(/([.!?]+\s+)/);
  for (let i = 0; i < parts.length; i += 2) {
    const seg = parts[i];
    if (seg && seg.trim()) {
      parts[i] = seg.replace(/^[\s]*([a-zA-Z\p{L}])/u, (m) => m.toUpperCase());
    }
  }
  return parts.join('');
}
const LITTLE_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via']);
function toTitleCase(s: string) {
  const words = s.toLowerCase().split(/(\s+)/);
  return words
    .map((w, i) => {
      if (/^\s+$/.test(w)) return w;
      if (i === 0 || i === words.length - 1) return w.charAt(0).toUpperCase() + w.slice(1);
      return LITTLE_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join('');
}

type CaseMode = 'none' | 'lower' | 'upper' | 'sentence' | 'title';

/* Component */
export default function TextCleanerPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // toggles
  const [trimEnds, setTrimEnds] = useState(true);
  const [doCollapseSpaces, setDoCollapseSpaces] = useState(true);
  const [doCollapseNewlines, setDoCollapseNewlines] = useState(true);
  const [doTrimEachLine, setDoTrimEachLine] = useState(true);
  const [doRemoveEmptyLines, setDoRemoveEmptyLines] = useState(true);
  const [doSmartToStraight, setDoSmartToStraight] = useState(true);
  const [doStripHtml, setDoStripHtml] = useState(false);
  const [doDecodeEntities, setDoDecodeEntities] = useState(false);
  const [doRemoveUrls, setDoRemoveUrls] = useState(false);
  const [doRemoveEmails, setDoRemoveEmails] = useState(false);
  const [doRemoveEmojis, setDoRemoveEmojis] = useState(false);
  const [doRemovePunct, setDoRemovePunct] = useState(false);
  const [doRemoveDiacritics, setDoRemoveDiacritics] = useState(false);
  const [doAsciiOnly, setDoAsciiOnly] = useState(false);
  const [caseMode, setCaseMode] = useState<CaseMode>('none');

  // persist input
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setInput(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, input);
    } catch {}
  }, [input]);

  // recompute live output
  useEffect(() => {
    let s = input ?? '';
    if (doDecodeEntities) s = decodeHtmlEntities(s);
    if (doStripHtml) s = stripHtmlTags(s);
    if (doSmartToStraight) s = smartQuotesToStraight(s);
    if (doRemoveUrls) s = removeUrls(s);
    if (doRemoveEmails) s = removeEmails(s);
    if (doRemoveEmojis) s = removeEmojis(s);
    if (doRemovePunct) s = removePunctuation(s);
    if (doRemoveDiacritics) s = removeDiacritics(s);
    if (doAsciiOnly) s = keepAsciiOnly(s);

    if (doTrimEachLine) s = trimEachLine(s);
    if (doRemoveEmptyLines) s = removeEmptyLines(s);
    if (doCollapseSpaces) s = collapseSpaces(s);
    if (doCollapseNewlines) s = collapseNewlines(s);
    if (trimEnds) s = s.trim();

    switch (caseMode) {
      case 'lower':
        s = s.toLowerCase();
        break;
      case 'upper':
        s = s.toUpperCase();
        break;
      case 'sentence':
        s = toSentenceCase(s);
        break;
      case 'title':
        s = toTitleCase(s);
        break;
      default:
        break;
    }
    setOutput(s);
  }, [
    input,
    trimEnds,
    doCollapseSpaces,
    doCollapseNewlines,
    doTrimEachLine,
    doRemoveEmptyLines,
    doSmartToStraight,
    doStripHtml,
    doDecodeEntities,
    doRemoveUrls,
    doRemoveEmails,
    doRemoveEmojis,
    doRemovePunct,
    doRemoveDiacritics,
    doAsciiOnly,
    caseMode,
  ]);

  const statsBefore = useMemo(
    () => ({
      chars: input.length,
      words: countWords(input),
      lines: normalizeEOL(input).split('\n').length,
    }),
    [input],
  );

  const statsAfter = useMemo(
    () => ({
      chars: output.length,
      words: countWords(output),
      lines: normalizeEOL(output).split('\n').length,
    }),
    [output],
  );

  function resetAll() {
    setInput('');
    setOutput('');
    setTrimEnds(true);
    setDoCollapseSpaces(true);
    setDoCollapseNewlines(true);
    setDoTrimEachLine(true);
    setDoRemoveEmptyLines(true);
    setDoSmartToStraight(true);
    setDoStripHtml(false);
    setDoDecodeEntities(false);
    setDoRemoveUrls(false);
    setDoRemoveEmails(false);
    setDoRemoveEmojis(false);
    setDoRemovePunct(false);
    setDoRemoveDiacritics(false);
    setDoAsciiOnly(false);
    setCaseMode('none');
  }

  const inputHistory = [
    { label: 'Chars', value: statsBefore.chars },
    { label: 'Words', value: statsBefore.words },
    { label: 'Empty', value: statsBefore.words },
    { label: 'Unique', value: statsBefore.words },
    { label: 'Avg length', value: statsBefore.words },
  ];

  return (
    <>
      <ToolPageHeader
        icon={Sparkles}
        title="Text Cleaner"
        description="Remove extra spaces, emojis, HTML, etc."
        actions={
          <>
            <ImportFileButton
              accept=".txt,text/plain"
              variant="outline"
              className="gap-2"
              label="Import"
              onFiles={async (files) => {
                const f = files?.[0];
                if (!f) return;
                setInput(await f.text());
              }}
            />
            <DownloadTextButton variant="outline" filename="cleaned.txt" getText={() => output || input || ''} label="Export" disabled={!input && !output} />
            <ResetButton onClick={resetAll} />
          </>
        }
      />

      {/* Input */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Input</CardTitle>
          <CardDescription>Paste your text below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <TextareaField value={input} onValueChange={setInput} textareaClassName="min-h-[220px] font-mono" placeholder={`“Hello”—world!  Visit https://example.com\n\n<p>Bangla: দেশ — ভালো? 😊`} />

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs text-muted-foreground">
            <div className="rounded-md border p-2">
              Chars: <strong>{statsBefore.chars}</strong>
            </div>
            <div className="rounded-md border p-2">
              Words: <strong>{statsBefore.words}</strong>
            </div>
            <div className="rounded-md border p-2">
              Lines: <strong>{statsBefore.lines}</strong>
            </div>
            <div className="rounded-md border p-2">
              → Chars: <strong>{statsAfter.chars}</strong>
            </div>
            <div className="rounded-md border p-2">
              → Words: <strong>{statsAfter.words}</strong>
            </div>
            <div className="rounded-md border p-2">
              → Lines: <strong>{statsAfter.lines}</strong>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator />

      {/* Options */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Cleaning Options</CardTitle>
          <CardDescription>Pick what to remove/normalize. Case is applied last.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border p-3 space-y-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" /> Whitespace & Lines
              </div>
              <SwitchRow label="Trim ends" checked={trimEnds} onChange={setTrimEnds} />
              <SwitchRow label="Collapse spaces" checked={doCollapseSpaces} onChange={setDoCollapseSpaces} />
              <SwitchRow label="Collapse newlines" checked={doCollapseNewlines} onChange={setDoCollapseNewlines} />
              <SwitchRow label="Trim each line" checked={doTrimEachLine} onChange={setDoTrimEachLine} />
              <SwitchRow label="Remove empty lines" checked={doRemoveEmptyLines} onChange={setDoRemoveEmptyLines} />
            </div>

            <div className="rounded-md border p-3 space-y-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" /> Text Normalization
              </div>
              <SwitchRow label="Smart → straight quotes/dashes" checked={doSmartToStraight} onChange={setDoSmartToStraight} />
              <SwitchRow label="Strip HTML tags" checked={doStripHtml} onChange={setDoStripHtml} />
              <SwitchRow label="Decode HTML entities" checked={doDecodeEntities} onChange={setDoDecodeEntities} />
              <SwitchRow label="Remove URLs" checked={doRemoveUrls} onChange={setDoRemoveUrls} />
              <SwitchRow label="Remove emails" checked={doRemoveEmails} onChange={setDoRemoveEmails} />
              <SwitchRow label="Remove emojis" checked={doRemoveEmojis} onChange={setDoRemoveEmojis} />
              <SwitchRow label="Remove punctuation" checked={doRemovePunct} onChange={setDoRemovePunct} />
              <SwitchRow label="Remove diacritics (accents)" checked={doRemoveDiacritics} onChange={setDoRemoveDiacritics} />
              <SwitchRow label="ASCII only" checked={doAsciiOnly} onChange={setDoAsciiOnly} />
            </div>
          </div>

          <SelectField
            label="Change Case"
            value={caseMode}
            onValueChange={(v) => setCaseMode(v as CaseMode)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'lower', label: 'lowercase' },
              { value: 'upper', label: 'UPPERCASE' },
              { value: 'sentence', label: 'Sentence case' },
              { value: 'title', label: 'Title Case' },
            ]}
          />
        </CardContent>
      </GlassCard>

      <Separator />

      {/* Output */}
      <GlassCard>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Output</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </div>
          <CardDescription>Result updates automatically as you type or toggle options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <TextareaField readOnly value={output} onValueChange={() => {}} textareaClassName="min-h-[220px] font-mono" />
          <div className="flex flex-wrap gap-2">
            <DownloadTextButton filename="cleaned.txt" getText={() => output} disabled={!output} />
            <Button variant="outline" className="gap-2" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
              <Copy className="h-4 w-4" /> Copy Output
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setInput(output)} disabled={!output}>
              <Eraser className="h-4 w-4" /> Replace Input
            </Button>
          </div>
        </CardContent>
      </GlassCard>
    </>
  );
}
