'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, RefreshCw, Hash, Download, RotateCcw, Settings2 } from 'lucide-react';

// ---------- Helpers ----------

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

// UUID v4
function makeUUID(withHyphens = true) {
  const s = crypto.randomUUID();
  if (withHyphens) return s;
  return s.replace(/-/g, '');
}

// NanoID
function makeNanoId(len = 12, alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  const chars = alphabet;
  return Array.from(arr).map((b) => chars[b % chars.length]).join('');
}

// ULID (Crockford base32)
const CROCK = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function encodeBase32Crockford(bytes: Uint8Array) {
  let value = 0n;
  for (const b of bytes) value = (value << 8n) | BigInt(b);
  const out: string[] = [];
  const totalBits = BigInt(bytes.length * 8);
  const mask = 31n;
  for (let bits = totalBits; bits > 0n; bits -= 5n) {
    const shift = bits - 5n;
    const idx = Number((value >> (shift < 0n ? 0n : shift)) & mask);
    out.push(CROCK[idx] ?? '0');
  }
  return out.join('');
}
function makeULID() {
  const time = Date.now(); // 48 bits
  const timeBytes = new Uint8Array(6);
  for (let i = 5; i >= 0; i--) {
    timeBytes[i] = time & 0xff;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (time as any) >>>= 8; // safe enough for 48-bit portion
  }
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  const full = new Uint8Array(16);
  full.set(timeBytes, 0);
  full.set(rand, 6);
  // ULID string is 26 chars crockford base32 of 128 bits, but leading groups may be short; pad to 26
  let s = encodeBase32Crockford(full);
  if (s.length < 26) s = s.padStart(26, '0');
  if (s.length > 26) s = s.slice(-26);
  return s;
}

// Order ID (readable)
function makeOrderId(prefix = 'ORD', dateFmt: 'epoch' | 'YMDHM' | 'YMD' = 'YMDHM', suffix = '') {
  const d = new Date();
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const base =
    dateFmt === 'epoch'
      ? String(d.getTime())
      : dateFmt === 'YMD'
      ? `${y}${m}${day}`
      : `${y}${m}${day}-${hh}${mm}`;
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const core = `${base}-${rand}`;
  return [prefix, core, suffix].filter(Boolean).join('-');
}

// ShortID from timestamp (base36)
function makeShortId(prefix = '') {
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 1e6).toString(36);
  return [prefix, t + r].filter(Boolean).join('-');
}

// ---------- Types ----------

type Mode = 'uuid' | 'uuid-nh' | 'nanoid' | 'ulid' | 'order' | 'short';

// ---------- Page ----------

export default function IdGeneratorPage() {
  const [items, setItems] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<Mode>('uuid');

  // options
  const [uuidHyphens, setUuidHyphens] = useState(true);
  const [nanoidLen, setNanoidLen] = useState(12);
  const [nanoidAlphabet, setNanoidAlphabet] = useState('0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'); // no 0/O/I/l
  const [ensureUnique, setEnsureUnique] = useState(true);

  const [ordPrefix, setOrdPrefix] = useState('ORD');
  const [ordSuffix, setOrdSuffix] = useState('');
  const [ordFmt, setOrdFmt] = useState<'epoch' | 'YMDHM' | 'YMD'>('YMDHM');

  const [shortPrefix, setShortPrefix] = useState('');

  const [copied, setCopied] = useState<string | null>(null);

  // persistence
  useEffect(() => {
    try {
      const s = localStorage.getItem('tools:idgen:state');
      if (s) {
        const obj = JSON.parse(s);
        setCount(obj.count ?? 10);
        setMode(obj.mode ?? 'uuid');
        setUuidHyphens(obj.uuidHyphens ?? true);
        setNanoidLen(obj.nanoidLen ?? 12);
        setNanoidAlphabet(obj.nanoidAlphabet ?? nanoidAlphabet);
        setEnsureUnique(obj.ensureUnique ?? true);
        setOrdPrefix(obj.ordPrefix ?? 'ORD');
        setOrdSuffix(obj.ordSuffix ?? '');
        setOrdFmt(obj.ordFmt ?? 'YMDHM');
        setShortPrefix(obj.shortPrefix ?? '');
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'tools:idgen:state',
        JSON.stringify({ count, mode, uuidHyphens, nanoidLen, nanoidAlphabet, ensureUnique, ordPrefix, ordSuffix, ordFmt, shortPrefix })
      );
    } catch {}
  }, [count, mode, uuidHyphens, nanoidLen, nanoidAlphabet, ensureUnique, ordPrefix, ordSuffix, ordFmt, shortPrefix]);

  const genOne = () => {
    switch (mode) {
      case 'uuid':
        return makeUUID(uuidHyphens);
      case 'uuid-nh':
        return makeUUID(false);
      case 'nanoid':
        return makeNanoId(nanoidLen, nanoidAlphabet);
      case 'ulid':
        return makeULID();
      case 'order':
        return makeOrderId(ordPrefix, ordFmt, ordSuffix);
      case 'short':
        return makeShortId(shortPrefix);
    }
  };

  const run = () => {
    const out: string[] = [];
    const seen = new Set<string>();
    let safety = count * 5;
    while (out.length < count && safety-- > 0) {
      const id = genOne();
      if (!ensureUnique || !seen.has(id)) {
        out.push(id);
        seen.add(id);
      }
    }
    setItems(out);
  };

  const copyOne = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(txt);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(items.join('
'));
      setCopied('ALL');
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  const exportTxt = () => download('ids.txt', items.join('
'), 'text/plain');
  const exportCsv = () => {
    const rows = ['index,type,id', ...items.map((id, i) => `${i + 1},${mode},${id}`)];
    download('ids.csv', rows.join('
'), 'text/csv');
  };

  const resetAll = () => {
    setItems([]);
    setCount(10);
    setMode('uuid');
    setUuidHyphens(true);
    setNanoidLen(12);
    setNanoidAlphabet('0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
    setEnsureUnique(true);
    setOrdPrefix('ORD');
    setOrdSuffix('');
    setOrdFmt('YMDHM');
    setShortPrefix('');
  };

  // Stats
  const stats = useMemo(() => ({ total: items.length }), [items]);

  return (
    <div className="space-y-4">
      <MotionGlassCard>
        <GlassCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Hash className="h-6 w-6" /> GUID / Order ID
            </h1>
            <p className="text-sm text-muted-foreground">Generate UUID, ULID, NanoID, readable Order IDs, and short IDs.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetAll} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
            <Button variant="outline" onClick={exportTxt} className="gap-2"><Download className="h-4 w-4" /> .txt</Button>
            <Button variant="outline" onClick={exportCsv} className="gap-2"><Download className="h-4 w-4" /> .csv</Button>
            <Button onClick={run} className="gap-2"><RefreshCw className="h-4 w-4" /> Generate</Button>
          </div>
        </GlassCard>

        {/* Settings */}
        <GlassCard className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
            <CardDescription>Type, count, and options.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="count">Count</Label>
              <Input id="count" type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))} />
              <div className="flex items-center gap-2 pt-2 text-sm">
                <Switch checked={ensureUnique} onCheckedChange={setEnsureUnique} /> Ensure unique
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Button variant={mode === 'uuid' ? 'default' : 'outline'} onClick={() => setMode('uuid')}>UUID</Button>
                <Button variant={mode === 'uuid-nh' ? 'default' : 'outline'} onClick={() => setMode('uuid-nh')}>UUID (no -)</Button>
                <Button variant={mode === 'ulid' ? 'default' : 'outline'} onClick={() => setMode('ulid')}>ULID</Button>
                <Button variant={mode === 'nanoid' ? 'default' : 'outline'} onClick={() => setMode('nanoid')}>NanoID</Button>
                <Button variant={mode === 'order' ? 'default' : 'outline'} onClick={() => setMode('order')}>OrderID</Button>
                <Button variant={mode === 'short' ? 'default' : 'outline'} onClick={() => setMode('short')}>ShortID</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Settings2 className="h-4 w-4" /> Options</Label>
              {mode === 'uuid' || mode === 'uuid-nh' ? (
                <div className="text-sm">
                  <div className="flex items-center gap-2"><Switch checked={uuidHyphens} onCheckedChange={setUuidHyphens} /> Keep hyphens</div>
                </div>
              ) : null}
              {mode === 'nanoid' ? (
                <div className="space-y-2 text-sm">
                  <Label htmlFor="nlen">Length</Label>
                  <Input id="nlen" type="number" min={4} max={128} value={nanoidLen} onChange={(e) => setNanoidLen(Math.min(128, Math.max(4, Number(e.target.value) || 4)))} />
                  <Label htmlFor="nalph">Alphabet</Label>
                  <Input id="nalph" value={nanoidAlphabet} onChange={(e) => setNanoidAlphabet(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Exclude ambiguous chars: 0 O I l</p>
                </div>
              ) : null}
              {mode === 'order' ? (
                <div className="grid gap-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="opre">Prefix</Label>
                      <Input id="opre" value={ordPrefix} onChange={(e) => setOrdPrefix(e.target.value.toUpperCase())} />
                    </div>
                    <div>
                      <Label htmlFor="osuf">Suffix</Label>
                      <Input id="osuf" value={ordSuffix} onChange={(e) => setOrdSuffix(e.target.value.toUpperCase())} />
                    </div>
                  </div>
                  <Label>Date format</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant={ordFmt === 'YMDHM' ? 'default' : 'outline'} onClick={() => setOrdFmt('YMDHM')}>YYYYMMDD-HHMM</Button>
                    <Button size="sm" variant={ordFmt === 'YMD' ? 'default' : 'outline'} onClick={() => setOrdFmt('YMD')}>YYYYMMDD</Button>
                    <Button size="sm" variant={ordFmt === 'epoch' ? 'default' : 'outline'} onClick={() => setOrdFmt('epoch')}>Epoch</Button>
                  </div>
                </div>
              ) : null}
              {mode === 'short' ? (
                <div className="text-sm">
                  <Label htmlFor="sp">Prefix</Label>
                  <Input id="sp" value={shortPrefix} onChange={(e) => setShortPrefix(e.target.value)} />
                </div>
              ) : null}
            </div>
          </CardContent>
        </GlassCard>

        <Separator />

        {/* Results */}
        <GlassCard className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Generated IDs</CardTitle>
            <CardDescription>Copy individual or all.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{stats.total} total</Badge>
              <Button size="sm" variant="outline" className="gap-2" onClick={copyAll}>{copied === 'ALL' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy all</Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.length === 0 && <p className="text-sm text-muted-foreground">No IDs yet. Click Generate.</p>}
              {items.map((id) => (
                <div key={id} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-mono text-sm break-all">{id}</span>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => copyOne(id)}>
                    {copied === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </MotionGlassCard>
    </div>
  );
}
