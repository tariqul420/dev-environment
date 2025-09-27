'use client';

import SectionHeader from '@/components/root/section-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard, MotionGlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import QRCode from 'react-qr-code';

import { AlertTriangle, CheckCircle2, Copy, Download, Image as ImageIcon, Link as LinkIcon, QrCode, RefreshCcw, Share2, Type, Wand2 } from 'lucide-react';

import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type ECC = 'L' | 'M' | 'Q' | 'H';
type GradDir = 'to-r' | 'to-b' | 'radial';
type ContentType = 'url' | 'text' | 'wifi' | 'email' | 'sms' | 'vcard';

/* ---------------------- color + contrast helpers ---------------------- */
function hexToRgb(hex: string) {
  const m = hex.replace('#', '');
  const n =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  const i = parseInt(n, 16);
  return { r: (i >> 16) & 255, g: (i >> 8) & 255, b: i & 255 };
}
function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(a: string, b: string) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const hi = Math.max(L1, L2) + 0.05;
  const lo = Math.min(L1, L2) + 0.05;
  return hi / lo;
}
function mixHex(a: string, b: string, t = 0.5) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ra = (pa >> 16) & 255,
    ga = (pa >> 8) & 255,
    ba = pa & 255;
  const rb = (pb >> 16) & 255,
    gb = (pb >> 8) & 255,
    bb = pb & 255;
  const r = Math.round(ra * (1 - t) + rb * t);
  const g = Math.round(ga * (1 - t) + gb * t);
  const b2 = Math.round(ba * (1 - t) + bb * t);
  return '#' + [r, g, b2].map((n) => n.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------ page ------------------------------ */
export default function AdvancedQRPage() {
  // ---------- content builders ----------
  const [contentType, setContentType] = useState<ContentType>('url');
  const [urlValue, setUrlValue] = useState('https://tariqul.dev');
  const [textValue, setTextValue] = useState('');
  const [wifi, setWifi] = useState({ ssid: '', pass: '', enc: 'WPA', hidden: false });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [sms, setSms] = useState({ to: '', body: '' });
  const [vcard, setVcard] = useState({ name: '', org: '', title: '', phone: '', email: '', url: '' });

  const value = useMemo(() => {
    switch (contentType) {
      case 'url': {
        const raw = urlValue.trim();
        if (!raw) return '';
        return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      }
      case 'text':
        return textValue;
      case 'wifi': {
        const h = wifi.hidden ? ';H:true' : '';
        return `WIFI:T:${wifi.enc};S:${wifi.ssid};P:${wifi.pass}${h};`;
      }
      case 'email': {
        const p = new URLSearchParams();
        if (email.subject) p.set('subject', email.subject);
        if (email.body) p.set('body', email.body);
        return `mailto:${email.to}${p.toString() ? `?${p.toString()}` : ''}`;
      }
      case 'sms': {
        const p = new URLSearchParams();
        if (sms.body) p.set('body', sms.body);
        return `sms:${sms.to}${p.toString() ? `?${p.toString()}` : ''}`;
      }
      case 'vcard': {
        const lines = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          vcard.name ? `FN:${vcard.name}` : '',
          vcard.org ? `ORG:${vcard.org}` : '',
          vcard.title ? `TITLE:${vcard.title}` : '',
          vcard.phone ? `TEL;TYPE=CELL:${vcard.phone}` : '',
          vcard.email ? `EMAIL:${vcard.email}` : '',
          vcard.url ? `URL:${vcard.url}` : '',
          'END:VCARD',
        ].filter(Boolean);
        return lines.join('\n');
      }
    }
  }, [contentType, urlValue, textValue, wifi, email, sms, vcard]);

  // ---------- visual settings ----------
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(16);
  const [level, setLevel] = useState<ECC>('M');
  const [rounded, setRounded] = useState(24);

  // colors
  const [useGradient, setUseGradient] = useState(true);
  const [gradFrom, setGradFrom] = useState('#a78bfa'); // violet-400
  const [gradTo, setGradTo] = useState('#60a5fa'); // blue-400
  const [gradDir, setGradDir] = useState<GradDir>('to-r');
  const [fgManual, setFgManual] = useState('#0f172a');
  const [bgSolid, setBgSolid] = useState('#0b1220');
  const [autoFg, setAutoFg] = useState(true);

  // label
  const [label, setLabel] = useState('');
  const [labelPos, setLabelPos] = useState<'top' | 'bottom'>('bottom');

  // logo
  const [logoUrl, setLogoUrl] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoPct, setLogoPct] = useState(20);
  const [logoBg, setLogoBg] = useState(true);
  const [logoRound, setLogoRound] = useState(12);
  const [logoBorder, setLogoBorder] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // export
  const [fileName, setFileName] = useState('qr');
  const [withTimestamp, setWithTimestamp] = useState(true);

  // derived
  const hasLogo = !!logoDataUrl || !!logoUrl;
  const total = size + margin * 2;
  const svgWrapperRef = useRef<HTMLDivElement | null>(null);

  const gradientStyle = useMemo(() => {
    if (!useGradient) return { background: bgSolid } as React.CSSProperties;
    if (gradDir === 'radial') {
      return { background: `radial-gradient(circle at 50% 50%, ${gradFrom}, ${gradTo})` } as React.CSSProperties;
    }
    const dir = gradDir === 'to-r' ? 'to right' : 'to bottom';
    return { background: `linear-gradient(${dir}, ${gradFrom}, ${gradTo})` } as React.CSSProperties;
  }, [useGradient, gradDir, gradFrom, gradTo, bgSolid]);

  // choose a visible ink automatically against the background
  const effectiveFg = useMemo(() => {
    if (!autoFg) return fgManual;
    const sampleBg = useGradient ? mixHex(gradFrom, gradTo, 0.5) : bgSolid;
    // prefer dark ink if contrast is OK, otherwise white
    const dark = '#0f172a';
    const light = '#ffffff';
    return contrastRatio(dark, sampleBg) >= 3 ? dark : light;
  }, [autoFg, useGradient, gradFrom, gradTo, bgSolid, fgManual]);

  const contrast = useMemo(() => {
    const bg = useGradient ? mixHex(gradFrom, gradTo, 0.5) : bgSolid;
    return contrastRatio(effectiveFg, bg);
  }, [effectiveFg, useGradient, gradFrom, gradTo, bgSolid]);

  const okContrast = contrast >= 2.5;
  const warnECC = hasLogo && level !== 'H' && logoPct >= 18;

  /* ------------------------------ helpers ------------------------------ */
  const copy = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
      toast.success('Copied');
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(String(reader.result));
    reader.readAsDataURL(f);
  };

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  // export filenames
  const withName = (ext: string) => {
    const base = fileName.trim() || 'qr';
    const stamp = withTimestamp ? `-${new Date().toISOString().replace(/[:.]/g, '-')}` : '';
    return `${base}${stamp}.${ext}`;
  };

  const downloadSVG = () => {
    const svg = svgWrapperRef.current?.querySelector('svg');
    if (!svg) return;

    // clone for clean export
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    // ensure our chosen fg color is set on modules
    cloned.querySelectorAll('path').forEach((p) => {
      p.removeAttribute('stroke');
      p.setAttribute('fill', effectiveFg);
    });

    const src = new XMLSerializer().serializeToString(cloned);
    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = withName('svg');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svg = svgWrapperRef.current?.querySelector('svg');
    if (!svg) return;
    const src = new XMLSerializer().serializeToString(svg);
    const svg64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);

    const img = new Image();
    const scale = 2; // retina export
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = total * scale;
      canvas.height = total * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // background
      if (useGradient) {
        if (gradDir === 'radial') {
          const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2);
          g.addColorStop(0, gradFrom);
          g.addColorStop(1, gradTo);
          ctx.fillStyle = g;
        } else {
          const g = ctx.createLinearGradient(0, 0, gradDir === 'to-r' ? canvas.width : 0, gradDir === 'to-b' ? canvas.height : 0);
          g.addColorStop(0, gradFrom);
          g.addColorStop(1, gradTo);
          ctx.fillStyle = g;
        }
      } else {
        ctx.fillStyle = bgSolid;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw QR
      const qrSize = size * scale;
      const pad = margin * scale;
      ctx.drawImage(img as HTMLImageElement, pad, pad, qrSize, qrSize);

      // label (optional)
      if (label) {
        ctx.save();
        ctx.font = `${14 * scale}px ui-sans-serif, system-ui, -apple-system`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#111827';
        const textY = labelPos === 'top' ? pad / 2 : canvas.height - pad / 2;
        ctx.fillText(label, canvas.width / 2, textY);
        ctx.restore();
      }

      // logo (optional)
      const drawLogo = () => {
        const l = size * (logoPct / 100) * scale;
        const x = (canvas.width - l) / 2;
        const y = (canvas.height - l) / 2;
        if (logoBg) {
          ctx.save();
          ctx.fillStyle = '#ffffff';
          roundRect(ctx, x, y, l, l, logoRound * scale);
          ctx.fill();
          if (logoBorder > 0) {
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = logoBorder * scale;
            ctx.stroke();
          }
          ctx.restore();
        }
        const logo = new Image();
        const srcLogo = logoDataUrl || logoUrl;
        if (!srcLogo) return finish();
        logo.onload = () => {
          ctx.drawImage(logo, x, y, l, l);
          finish();
        };
        logo.crossOrigin = 'anonymous';
        logo.src = srcLogo;
      };

      const finish = () => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = withName('png');
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      if (hasLogo) drawLogo();
      else finish();
    };
    img.crossOrigin = 'anonymous';
    img.src = svg64;
  };

  const copySvgMarkup = async () => {
    const svg = svgWrapperRef.current?.querySelector('svg');
    if (!svg) return;
    const src = new XMLSerializer().serializeToString(svg);
    try {
      await navigator.clipboard.writeText(src);
      toast({ title: 'SVG copied', duration: 1200 });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const share = async () => {
    if (typeof navigator === 'undefined' || !('share' in navigator)) return;
    try {
      // @ts-ignore
      await navigator.share({ title: 'QR code', text: value, url: /^https?:\/\//i.test(value) ? value : undefined });
    } catch {}
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <SectionHeader title="QR Code (Advanced)" desc="Export-ready QR with gradients, auto contrast, logo overlay, label, and content builders (URL, Wi-Fi, vCard)." />

      <MotionGlassCard className="p-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT: Controls */}
          <div className="grid gap-6">
            {/* Content builder */}
            <GlassCard className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Content</Label>
                  <Badge variant="secondary" className="gap-1">
                    <QrCode className="h-3.5 w-3.5" />
                    Live
                  </Badge>
                </div>
                <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                  <SelectTrigger className="h-8 w-44 bg-background/60 backdrop-blur">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="wifi">Wi-Fi</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="vcard">vCard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-3 grid gap-3">
                {contentType === 'url' && (
                  <div className="flex gap-2">
                    <Input value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="https://example.com" className="bg-background/60 backdrop-blur" />
                    <Button variant="outline" onClick={() => setUrlValue(window.location.href)}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => setUrlValue('')}>
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => copy(urlValue)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {contentType === 'text' && <Input value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="Freeform text…" />}

                {contentType === 'wifi' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} placeholder="SSID" />
                    <Input value={wifi.pass} onChange={(e) => setWifi({ ...wifi, pass: e.target.value })} placeholder="Password" />
                    <div className="grid gap-1">
                      <Label>Encryption</Label>
                      <Select value={wifi.enc} onValueChange={(v) => setWifi({ ...wifi, enc: v })}>
                        <SelectTrigger className="bg-background/60 backdrop-blur">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-2">
                      <Label className="text-sm">Hidden SSID</Label>
                      <Switch checked={wifi.hidden} onCheckedChange={(v) => setWifi({ ...wifi, hidden: v })} />
                    </div>
                  </div>
                )}

                {contentType === 'email' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={email.to} onChange={(e) => setEmail({ ...email, to: e.target.value })} placeholder="to@example.com" />
                    <Input value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} placeholder="Subject" />
                    <div className="sm:col-span-2">
                      <Input value={email.body} onChange={(e) => setEmail({ ...email, body: e.target.value })} placeholder="Body" />
                    </div>
                  </div>
                )}

                {contentType === 'sms' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={sms.to} onChange={(e) => setSms({ ...sms, to: e.target.value })} placeholder="+8801XXXXXXXXX" />
                    <Input value={sms.body} onChange={(e) => setSms({ ...sms, body: e.target.value })} placeholder="Message" />
                  </div>
                )}

                {contentType === 'vcard' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={vcard.name} onChange={(e) => setVcard({ ...vcard, name: e.target.value })} placeholder="Full name" />
                    <Input value={vcard.title} onChange={(e) => setVcard({ ...vcard, title: e.target.value })} placeholder="Title" />
                    <Input value={vcard.org} onChange={(e) => setVcard({ ...vcard, org: e.target.value })} placeholder="Organization" />
                    <Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} placeholder="Phone" />
                    <Input value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} placeholder="Email" />
                    <Input value={vcard.url} onChange={(e) => setVcard({ ...vcard, url: e.target.value })} placeholder="Website" />
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Display options */}
            <GlassCard className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Size: {size}px</Label>
                  <input type="range" min={160} max={512} value={size} onChange={(e) => setSize(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>Margin: {margin}px</Label>
                  <input type="range" min={0} max={48} value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>Container radius: {rounded}px</Label>
                  <input type="range" min={0} max={40} value={rounded} onChange={(e) => setRounded(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>ECC Level</Label>
                  <Select value={level} onValueChange={(v) => setLevel(v as ECC)}>
                    <SelectTrigger className="bg-background/60 backdrop-blur">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L (low)</SelectItem>
                      <SelectItem value="M">M (medium)</SelectItem>
                      <SelectItem value="Q">Q (quartile)</SelectItem>
                      <SelectItem value="H">H (high)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>

            {/* Colors */}
            <GlassCard className="p-4">
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>Background gradient</span>
                  <Switch checked={useGradient} onCheckedChange={setUseGradient} />
                </div>
                <div className="flex items-center gap-3">
                  <span>Auto ink color</span>
                  <Switch checked={autoFg} onCheckedChange={setAutoFg} />
                </div>
              </div>

              {useGradient ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>From</Label>
                    <Input type="color" value={gradFrom} onChange={(e) => setGradFrom(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>To</Label>
                    <Input type="color" value={gradTo} onChange={(e) => setGradTo(e.target.value)} />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label>Direction</Label>
                    <Select value={gradDir} onValueChange={(v) => setGradDir(v as GradDir)}>
                      <SelectTrigger className="bg-background/60 backdrop-blur">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-r">Left → Right</SelectItem>
                        <SelectItem value="to-b">Top → Bottom</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Foreground</Label>
                    <Input type="color" value={fgManual} onChange={(e) => setFgManual(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Background</Label>
                    <Input type="color" value={bgSolid} onChange={(e) => setBgSolid(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Guidance */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {okContrast ? (
                  <Badge className="gap-1" variant="secondary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Good contrast
                  </Badge>
                ) : (
                  <Badge className="gap-1" variant="destructive">
                    <AlertTriangle className="h-3.5 w-3.5" /> Low contrast — adjust colors
                  </Badge>
                )}
                {warnECC && (
                  <Badge className="gap-1" variant="outline">
                    <AlertTriangle className="h-3.5 w-3.5" /> Large logo — ECC H recommended
                  </Badge>
                )}
              </div>
            </GlassCard>

            {/* Logo */}
            <GlassCard className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <Label>Logo</Label>
                <Badge variant="outline" className="gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Optional
                </Badge>
              </div>
              <div className="grid gap-3">
                <div className="flex gap-2">
                  <Input placeholder="https://…/logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    Upload
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setLogoUrl('');
                      setLogoDataUrl(null);
                    }}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Size: {logoPct}%</Label>
                    <input type="range" min={10} max={36} value={logoPct} onChange={(e) => setLogoPct(Number(e.target.value))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Round: {logoRound}px</Label>
                    <input type="range" min={0} max={36} value={logoRound} onChange={(e) => setLogoRound(Number(e.target.value))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Border: {logoBorder}px</Label>
                    <input type="range" min={0} max={6} value={logoBorder} onChange={(e) => setLogoBorder(Number(e.target.value))} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <Label className="text-sm">White background under logo</Label>
                  <Switch checked={logoBg} onCheckedChange={setLogoBg} />
                </div>
              </div>
            </GlassCard>

            {/* Presets */}
            <GlassCard className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Wand2 className="h-4 w-4" /> Presets
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setUseGradient(true);
                    setGradFrom('#e9d5ff');
                    setGradTo('#93c5fd');
                    setGradDir('to-r');
                    setBgSolid('#ffffff');
                    setAutoFg(true);
                    setRounded(24);
                  }}>
                  Glass
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setUseGradient(false);
                    setBgSolid('#0b1220');
                    setFgManual('#e2e8f0');
                    setAutoFg(false);
                    setRounded(20);
                  }}>
                  Midnight
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setUseGradient(true);
                    setGradFrom('#fb7185');
                    setGradTo('#f59e0b');
                    setGradDir('to-b');
                    setAutoFg(true);
                    setRounded(28);
                  }}>
                  Sunset
                </Button>
              </div>
            </GlassCard>

            {/* Label */}
            <GlassCard className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4" /> Label
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., tariqul.dev" />
                </div>
                <div className="grid gap-2">
                  <Label>Position</Label>
                  <Select value={labelPos} onValueChange={(v) => setLabelPos(v as 'top' | 'bottom')}>
                    <SelectTrigger className="bg-background/60 backdrop-blur">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT: Preview & Export */}
          <div className="grid gap-4">
            <GlassCard className="p-4">
              <div className="text-sm text-muted-foreground">Preview</div>

              {label && labelPos === 'top' && <div className="mt-3 text-center text-xs font-medium text-foreground/80">{label}</div>}

              <div
                className="mt-3 mx-auto flex items-center justify-center shadow-sm ring-1 ring-black/5"
                style={{ width: total, height: total, padding: margin, borderRadius: rounded, ...gradientStyle }}>
                <div className="relative" ref={svgWrapperRef} style={{ width: size, height: size, lineHeight: 0 }} data-qr>
                  <QRCode
                    value={value || ' '}
                    size={size}
                    level={level}
                    fgColor={effectiveFg} // <-- always visible ink
                    bgColor={useGradient ? 'transparent' : bgSolid}
                    className="block"
                  />
                  {hasLogo && (
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                      style={{
                        width: size * (logoPct / 100),
                        height: size * (logoPct / 100),
                        borderRadius: logoBg ? logoRound : 0,
                        boxShadow: logoBorder ? `0 0 0 ${logoBorder}px rgba(229,231,235,1)` : 'none',
                        background: logoBg ? '#fff' : 'transparent',
                      }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={(logoDataUrl || logoUrl) as string} alt="logo" className="h-full w-full object-contain" crossOrigin="anonymous" />
                    </div>
                  )}
                </div>
              </div>

              {label && labelPos === 'bottom' && <div className="mt-3 text-center text-xs font-medium text-foreground/80">{label}</div>}
            </GlassCard>

            {/* Export */}
            <GlassCard className="p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
                <div className="grid gap-2">
                  <Label>Filename</Label>
                  <div className="flex items-center gap-2">
                    <Input value={fileName} onChange={(e) => setFileName(e.target.value)} className="bg-background/60 backdrop-blur" />
                    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
                      <Label className="text-xs">Timestamp</Label>
                      <Switch checked={withTimestamp} onCheckedChange={setWithTimestamp} />
                    </div>
                  </div>
                </div>
                <Button onClick={downloadPNG} className="gap-2">
                  <Download className="h-4 w-4" /> PNG
                </Button>
                <Button variant="outline" onClick={downloadSVG} className="gap-2">
                  <Download className="h-4 w-4" /> SVG
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copySvgMarkup} className="gap-2">
                    <Copy className="h-4 w-4" /> Copy SVG
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      // soft reset
                      setContentType('url');
                      setUrlValue('https://tariqul.dev');
                      setTextValue('');
                      setWifi({ ssid: '', pass: '', enc: 'WPA', hidden: false });
                      setEmail({ to: '', subject: '', body: '' });
                      setSms({ to: '', body: '' });
                      setVcard({ name: '', org: '', title: '', phone: '', email: '', url: '' });
                      setUseGradient(true);
                      setGradFrom('#a78bfa');
                      setGradTo('#60a5fa');
                      setGradDir('to-r');
                      setBgSolid('#0b1220');
                      setAutoFg(true);
                      setFgManual('#0f172a');
                      setRounded(24);
                      setLabel('');
                      setLabelPos('bottom');
                      setLogoUrl('');
                      setLogoDataUrl(null);
                      setLogoPct(20);
                      setLogoBg(true);
                      setLogoRound(12);
                      setLogoBorder(0);
                      setLevel('M');
                      setSize(320);
                      setMargin(16);
                    }}
                    title="Reset">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={share} className="gap-2" disabled={typeof navigator === 'undefined' || !('share' in navigator)}>
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </MotionGlassCard>
    </div>
  );
}
