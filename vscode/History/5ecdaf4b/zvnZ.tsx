'use client';

import { ExportTextButton, ResetButton } from '@/components/shared/action-buttons';
import ToolPageHeader from '@/components/shared/tool-page-header';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, Copy, Dice5, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
type HistoryItem = { id: string; ts: number; winner: string; pool: number };

// Helpers
function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
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

export default function RandomPickerClient() {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('tools:randpicker:entries');
      if (s) setEntries(JSON.parse(s));
      const h = localStorage.getItem('tools:randpicker:history');
      if (h) setHistory(JSON.parse(h));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tools:randpicker:entries', JSON.stringify(entries));
    } catch {}
  }, [entries]);
  useEffect(() => {
    try {
      localStorage.setItem('tools:randpicker:history', JSON.stringify(history.slice(0, 20)));
    } catch {}
  }, [history]);

  const addEntries = () => {
    const lines = input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    setEntries((es) => [...es, ...lines.map((l) => ({ id: uid('e'), name: l }))]);
    setInput('');
  };

  const resetAll = () => {
    setEntries([]);
    setWinner(null);
    setHistory([]);
  };

  const pickWinner = () => {
    if (!entries.length) return;
    const i = Math.floor(Math.random() * entries.length);
    const w = entries[i].name;
    setWinner(w);
    setHistory((h) => [{ id: uid('h'), ts: Date.now(), winner: w, pool: entries.length }, ...h].slice(0, 20));
  };

  const copyWinner = async () => {
    if (!winner) return;
    try {
      await navigator.clipboard.writeText(winner);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const exportList = () => download('entries.txt', entries.map((e) => e.name).join('\n'), 'text/plain');

  return (
    <>
      <ToolPageHeader
        icon={Dice5}
        title="Random Picker"
        description="Pick a random winner from a list of names."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <ExportTextButton filename="entries.txt" getText={() => entries.map((e) => e.name).join('\n')} />
          </>
        }
      />

      {/* Input */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Add Entries</CardTitle>
          <CardDescription>One name per line.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Alice\nBob\nCharlie" className="min-h-[120px] font-mono" />
          <Button onClick={addEntries} className="gap-2 w-full sm:w-auto">
            <Users className="h-4 w-4" /> Add
          </Button>
        </CardContent>
      </GlassCard>

      <Separator />

      {/* Entries list */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Entries</CardTitle>
          <CardDescription>All current names</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          <ul className="list-disc pl-6 text-sm space-y-1">
            {entries.map((e) => (
              <li key={e.id}>{e.name}</li>
            ))}
          </ul>
        </CardContent>
      </GlassCard>

      {/* Winner */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Winner</CardTitle>
          <CardDescription>Click Pick to choose randomly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={pickWinner} className="gap-2">
            <Sparkles className="h-4 w-4" /> Pick Winner
          </Button>
          {winner ? (
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="font-semibold">{winner}</span>
              <Button size="sm" variant="outline" className="gap-2" onClick={copyWinner}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No winner yet.</p>
          )}
        </CardContent>
      </GlassCard>

      {/* History */}
      <GlassCard className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
          <CardDescription>Last 20 picks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.length === 0 && <p className="text-sm text-muted-foreground">No picks yet.</p>}
          <ul className="text-sm space-y-1">
            {history.map((h) => (
              <li key={h.id}>
                [{new Date(h.ts).toLocaleString()}] {h.winner} (from {h.pool} entries)
              </li>
            ))}
          </ul>
        </CardContent>
      </GlassCard>
    </>
  );
}
