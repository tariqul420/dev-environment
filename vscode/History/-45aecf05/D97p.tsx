'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowDownToLine, Copy, Image as ImageIcon, RefreshCw, ScanLine, Upload } from 'lucide-react';
import QRCode from 'qrcode';
import * as React from 'react';

type ECL = 'L' | 'M' | 'Q' | 'H';
type RenderFormat = 'png' | 'svg';

export default function QRGeneratorPage() {
  const [text, setText] = React.useState<string>('https://naturalsefaa.com');
  const [ecl, setEcl] = React.useState<ECL>('M');
  const [size, setSize] = React.useState<number>(320);
  const [margin, setMargin] = React.useState<number>(2);
  const [fg, setFg] = React.useState<string>('#0f172a'); // slate-900
  const [bg, setBg] = React.useState<string>('#ffffff');
  const [format, setFormat] = React.useState<RenderFormat>('png');
  const [exportScale, setExportScale] = React.useState<number>(2);

  const [logoEnabled, setLogoEnabled] = React.useState<boolean>(false);
  const [logoDataUrl, setLogoDataUrl] = React.useState<string | null>(null);
  const [logoSizePct, setLogoSizePct] = React.useState<number>(20);
  const [quietZone, setQuietZone] = React.useState<boolean>(true);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [svgMarkup, setSvgMarkup] = React.useState<string>('');

  const makeOptions = React.useCallback(
    (w: number) => ({
      width: w,
      margin: quietZone ? margin : 0,
      color: {
        dark: fg,
        light: bg,
      },
      errorCorrectionLevel: ecl,
    }),
    [ecl, fg, bg, margin, quietZone],
  );

  // Generate PNG (canvas) & optional SVG preview
  React.useEffect(() => {
    const val = text?.trim() || '';
    const safeVal = val.length ? val : 'Scan me';
    const options = makeOptions(size);

    // Canvas (PNG) preview
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, safeVal, options).then(async () => {
        if (logoEnabled && logoDataUrl && canvasRef.current) {
          await overlayLogo(canvasRef.current, logoDataUrl, logoSizePct);
        }
      });
    }

    // SVG preview (if requested)
    if (format === 'svg') {
      QRCode.toString(safeVal, { ...options, type: 'svg' }).then((svg) => {
        setSvgMarkup(svg);
      });
    } else {
      setSvgMarkup('');
    }
  }, [text, ecl, size, margin, fg, bg, format, logoEnabled, logoDataUrl, logoSizePct, makeOptions]);

  const resetAll = () => {
    setText('https://naturalsefaa.com');
    setEcl('M');
    setSize(320);
    setMargin(2);
    setFg('#0f172a');
    setBg('#ffffff');
    setFormat('png');
    setExportScale(2);
    setLogoEnabled(false);
    setLogoDataUrl(null);
    setLogoSizePct(20);
    setQuietZone(true);
  };

  const downloadPNG = async () => {
    const val = text?.trim() || 'Scan me';
    const exportSize = Math.max(64, Math.min(2048, size * exportScale));
    const offscreen = document.createElement('canvas');
    await QRCode.toCanvas(offscreen, val, makeOptions(exportSize));
    if (logoEnabled && logoDataUrl) {
      await overlayLogo(offscreen, logoDataUrl, logoSizePct);
    }
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = offscreen.toDataURL('image/png');
    link.click();
  };

  const downloadSVG = async () => {
    const val = text?.trim() || 'Scan me';
    const svg = await QRCode.toString(val, { ...makeOptions(size), type: 'svg' });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const copyDataUrl = async () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    await navigator.clipboard.writeText(url);
  };

  const handleLogoUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result as string);
      setLogoEnabled(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QR Code Generator</h1>
          <p className="text-sm text-muted-foreground">Create beautiful QR codes with logo, colors, and high-quality exports.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" onClick={resetAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Controls */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Content & Settings</CardTitle>
            <CardDescription>Customize data, quality, colors, size, and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="qr-text">Text / URL</Label>
              <Input id="qr-text" placeholder="Enter URL, text, Wi-Fi config, etc." value={text} onChange={(e) => setText(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <PresetButton label="URL" onClick={() => setText('https://naturalsefaa.com')} />
                <PresetButton label="Wi-Fi" onClick={() => setText('WIFI:T:WPA;S:MyNetwork;P:supersecret;H:false;')} />
                <PresetButton
                  label="vCard"
                  onClick={() =>
                    setText(
                      [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        'N:Tariqul;Islam;;;',
                        'FN:Tariqul Islam',
                        'ORG:Natural Sefa',
                        'TEL:+8801XXXXXXXXX',
                        'EMAIL:hello@naturalsefaa.com',
                        'URL:https://naturalsefaa.com',
                        'END:VCARD',
                      ].join('\n'),
                    )
                  }
                />
                <PresetButton label="Text" onClick={() => setText('Scan me')} />
              </div>
            </div>

            <Separator />

            {/* Quality */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Error Correction</Label>
                <Select value={ecl} onValueChange={(v) => setEcl(v as ECL)}>
                  <SelectTrigger>
                    <SelectValue placeholder="ECL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L (7%)</SelectItem>
                    <SelectItem value="M">M (15%)</SelectItem>
                    <SelectItem value="Q">Q (25%)</SelectItem>
                    <SelectItem value="H">H (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Render Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as RenderFormat)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Canvas) — Recommended</SelectItem>
                    <SelectItem value="svg">SVG (Vector)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <SettingSlider label={`Size: ${size}px`} min={128} max={1024} step={16} value={[size]} onValueChange={(v) => setSize(v[0])} />
              </div>

              <div className="space-y-2">
                <SettingSlider label={`Margin: ${margin}px`} min={0} max={16} step={1} value={[margin]} onValueChange={(v) => setMargin(v[0])} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorField label="Foreground" value={fg} onChange={setFg} />
              <ColorField label="Background" value={bg} onChange={setBg} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium leading-none">Quiet Zone</p>
                <p className="text-xs text-muted-foreground">Keep border padding around the code for better scanning.</p>
              </div>
              <Switch checked={quietZone} onCheckedChange={setQuietZone} />
            </div>

            <Separator />

            {/* Logo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">Center Logo</p>
                  <p className="text-xs text-muted-foreground">Overlay your brand mark in the middle (use with ECL Q/H).</p>
                </div>
                <Switch checked={logoEnabled} onCheckedChange={setLogoEnabled} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Upload Logo (PNG/SVG)</Label>
                  <div className="flex gap-2">
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                    <Button variant="outline" onClick={() => setLogoDataUrl(null)} disabled={!logoDataUrl}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <SettingSlider label={`Logo Size: ${logoSizePct}%`} min={10} max={40} step={1} value={[logoSizePct]} onValueChange={(v) => setLogoSizePct(v[0])} disabled={!logoEnabled} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Export */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SettingSlider label={`Export Scale: ${exportScale}x`} min={1} max={6} step={1} value={[exportScale]} onValueChange={(v) => setExportScale(v[0])} />
              <div className="flex items-end gap-2">
                <Button className="w-full" onClick={downloadPNG}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Download PNG
                </Button>
                <Button className="w-full" variant="outline" onClick={downloadSVG} disabled={format !== 'svg'}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={copyDataUrl}>
                <Copy className="mr-2 h-4 w-4" />
                Copy PNG Data URL
              </Button>
              <Button variant="ghost" onClick={resetAll}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>PNG canvas preview (recommended). Toggle SVG if you need vector.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex items-center justify-center rounded-xl border bg-muted/40 p-6">
                {format === 'svg' ? (
                  <div className="rounded-lg bg-white p-2 shadow-sm" dangerouslySetInnerHTML={{ __html: svgMarkup || '<svg />' }} />
                ) : (
                  <canvas ref={canvasRef} className="rounded-lg bg-white p-2 shadow-sm" style={{ width: size, height: size }} aria-label="QR preview" />
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <SmallStat icon={<ScanLine className="h-4 w-4" />} label="ECL" value={ecl} />
                <SmallStat icon={<ImageIcon className="h-4 w-4" />} label="Size" value={`${size}px`} />
                <SmallStat icon={<Upload className="h-4 w-4" />} label="Logo" value={logoEnabled ? 'On' : 'Off'} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      {label}
    </Button>
  );
}

function SmallStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SettingSlider({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
  disabled,
}: {
  label: string;
  value: number[];
  onValueChange: (v: number[]) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? 'opacity-60 pointer-events-none' : ''}>
      <Label className="mb-1 block">{label}</Label>
      <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="block">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" className="h-10 w-10 cursor-pointer rounded-md border bg-transparent p-1" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label} color`} />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="font-mono" />
      </div>
    </div>
  );
}

/**
 * Draw a center logo onto the given QR canvas.
 * Keeps sharp PNG exports and avoids SVG type issues.
 */
async function overlayLogo(canvas: HTMLCanvasElement, logoUrl: string, logoSizePct: number) {
  return new Promise<void>((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.round((Math.min(w, h) * logoSizePct) / 100);

      // Optional white backing for clarity
      const x = Math.round(w / 2 - size / 2);
      const y = Math.round(h / 2 - size / 2);
      const radius = Math.round(size * 0.2);

      // rounded rect backdrop
      ctx.save();
      roundedRect(ctx, x - 4, y - 4, size + 8, size + 8, radius);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.restore();

      ctx.drawImage(img, x, y, size, size);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoUrl;
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
