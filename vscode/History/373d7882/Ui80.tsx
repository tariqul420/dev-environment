'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Check,
  ClipboardList,
  Copy,
  Download,
  Eraser,
  History,
  Link2,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Share2,
  Tags,
  Trash2,
  Upload,
  Wand2,
} from 'lucide-react';

// ---------- Types ----------

type Pair = { id: string; key: string; value: string; enabled: boolean };

type UTMState = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  id: string;
  custom: Pair[];
};

type OptionsState = {
  keepExisting: boolean;
  encodeParams: boolean;
  lowercaseKeys: boolean;
  prefixCustomWithUTM: boolean;
  batchMode: boolean;
};

type Preset = {
  name: string;
  utm: UTMState;
  options: OptionsState;
};

type HistoryItem = {
  ts: number;
  base: string;
  result: string | string[];
};

// ---------- Helpers ----------

const DEFAULT_UTM: UTMState = {
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
  id: '',
  custom: [],
};

const DEFAULT_OPTS: OptionsState = {
  keepExisting: true,
  encodeParams: true,
  lowercaseKeys: true,
  prefixCustomWithUTM: false,
  batchMode: false,
};

const PRESET_LS_KEY = 'utm-builder-presets-v1';
const HISTORY_LS_KEY = 'utm-builder-history-v1';

function rid(prefix = 'row') {
  return `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`;
}

function encode(v: string, should: boolean) {
  return should ? encodeURIComponent(v) : v;
}

function cleanBaseUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    return `${u.origin}${u.pathname}${u.hash ?? ''}`;
  } catch {
    try {
      const u = new URL(`https://${trimmed}`);
      return `${u.origin}${u.pathname}${u.hash ?? ''}`;
    } catch {
      return trimmed;
    }
  }
}

function parseExisting(url: string) {
  try {
    const u = new URL(url);
    const p = u.searchParams;
    const out: Partial<UTMState> = {};
    const get = (k: string) => p.get(k) ?? '';
    out.source = get('utm_source');
    out.medium = get('utm_medium');
    out.campaign = get('utm_campaign');
    out.term = get('utm_term');
    out.content = get('utm_content');
    out.id = get('utm_id');
    const custom: Pair[] = [];
    p.forEach((v, k) => {
      if (!k.startsWith('utm_')) {
        custom.push({ id: rid('pair'), key: k, value: v, enabled: true });
      }
    });
    return { utm: { ...(DEFAULT_UTM as UTMState), ...(out as UTMState), custom }, baseNoQuery: cleanBaseUrl(url) };
  } catch {
    return null;
  }
}

function genShortId() {
  if (crypto?.getRandomValues) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).slice(2, 10);
}

function isValidUrl(s: string) {
  try {
    new URL(s);
    return true;
  } catch {
    try {
      new URL(`https://${s}`);
      return true;
    } catch {
      return false;
    }
  }
}

function buildSingle(baseUrl: string, utm: UTMState, opts: OptionsState) {
  // Guard: empty / whitespace
  if (!baseUrl || !baseUrl.trim()) return '';

  // Normalize protocol
  let base = baseUrl.trim();
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;

  // Validate URL safely (prevent cases like "https://")
  let u: URL;
  try {
    u = new URL(base);
    if (!u.hostname) return '';
  } catch {
    return '';
  }

  // keep existing params if requested
  const params = new URLSearchParams(opts.keepExisting ? u.search : '');

  const key = (k: string) => (opts.lowercaseKeys ? k.toLowerCase() : k);
  const set = (k: string, v: string) => {
    if (!v) return;
    params.set(key(k), encode(v, opts.encodeParams));
  };

  set('utm_source', utm.source);
  set('utm_medium', utm.medium);
  set('utm_campaign', utm.campaign);
  set('utm_term', utm.term);
  set('utm_content', utm.content);
  set('utm_id', utm.id);

  for (const c of utm.custom) {
    if (!c.enabled || !c.key) continue;
    const k = opts.prefixCustomWithUTM ? `utm_${c.key.replace(/^utm_/i, '')}` : c.key;
    set(k, c.value);
  }

  u.search = params.toString();
  return u.toString();
}

function csvDownload(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((cell) => {
          const v = (cell ?? '').toString().replace(/"/g, '""');
          return /[",\n]/.test(v) ? `"${v}"` : v;
        })
        .join(',')
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function UTMBuilderPage() {
  // ... unchanged state management ...

  // In HistoryList rendering:
  // Use type narrowing to fix TS errors
  // Example for Copy All:
  // if (Array.isArray(h.result)) { h.result.join('\n') }
}

// ---------- History List ----------
function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const x = JSON.parse(localStorage.getItem(HISTORY_LS_KEY) || '[]') as HistoryItem[];
      setItems(Array.isArray(x) ? x : []);
    } catch {}
  }, []);

  function clearAll() {
    localStorage.removeItem(HISTORY_LS_KEY);
    setItems([]);
  }

  return (
    <div className={cn('divide-y', items.length ? '' : 'p-3 text-sm text-muted-foreground')}>
      {!items.length && 'No history yet.'}
      {items.map((h, i) => (
        <>
        <div key={i} className="p-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleString()}</div>
            {Array.isArray(h.result) ? (
              (() => {
                const list = h.result as string[];
                return (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(list.join('
'))}
                    >
                      <Copy className="h-4 w-4" /> Copy All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => csvDownload('utm-history-batch.csv', [['URL'], ...list.map((r) => [r])])}
                    >
                      <Download className="h-4 w-4" /> CSV
                    </Button>
                  </>
                );
              })()
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(String(h.result))}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(String(h.result), '_blank', 'noopener')}>
                  <Share2 className="h-4 w-4" /> Open
                </Button>
              </>
            )}>
                  <Copy className="h-4 w-4" /> Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={() => csvDownload('utm-history-batch.csv', [['URL'], ...h.result.map((r) => [r])])}>
                  <Download className="h-4 w-4" /> CSV
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(String(h.result))}>
                  <Copy className="h-4 w-4" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(String(h.result), '_blank', 'noopener')}>
                  <Share2 className="h-4 w-4" /> Open
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
      {!!items.length && (
        <div className="p-3 flex justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={clearAll}>
            <Eraser className="h-4 w-4" /> Clear History
          </Button>
        </div>
      )}
    </div>
  );
}
