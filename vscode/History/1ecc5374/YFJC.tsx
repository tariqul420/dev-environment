"use client";

import {
  BookText,
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Loader2,
  Settings2,
} from "lucide-react";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { ImageDropzone } from "@/components/image/image-dropzone";
import { ImagePreview, InfoPill } from "@/components/image/image-preview-meta";
import { ActionButton, ResetButton } from "@/components/shared/action-buttons";
import { ProcessLog } from "@/components/shared/process-log";
import ToolPageHeader from "@/components/shared/tool-page-header";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useImageInput } from "@/hooks/use-image-input";
import { cn } from "@/lib/utils";

/* ---------------- types ---------------- */
type OcrEngine = "tesseract"; // future-proof

interface OcrResult {
  text: string;
  confidence: number | null;
}

/* -------------- page -------------- */
export default function ImageOcrPage() {
  const { img, getRootProps, getInputProps, isDragActive, setImg } = useImageInput({
    onImage: (im) => setLog(`Loaded ${im.file.name} (${formatBytes(im.size ?? im.file.size)})`),
  });

  // OCR options
  const [engine] = React.useState<OcrEngine>("tesseract");
  const [lang, setLang] = React.useState("eng"); // english default
  const [psm, setPsm] = React.useState<"3" | "6" | "7" | "11" | "13">("6"); // common PSMs
  const [scale, setScale] = React.useState<number>(150); // %
  const [grayscale, setGrayscale] = React.useState(true);
  const [binarize, setBinarize] = React.useState(false);
  const [threshold, setThreshold] = React.useState(180);

  // UI state
  const [running, setRunning] = React.useState(false);
  const [log, setLog] = React.useState("");
  const [text, setText] = React.useState("");
  const [confidence, setConfidence] = React.useState<number | null>(null);
  const [copied, setCopied] = React.useState(false);

  // dropzone (paste support already inside useImageInput hook)
  const dz = useDropzone({
    onDrop: () => {},
  });

  function resetAll() {
    setImg(null);
    setLang("eng");
    setPsm("6");
    setScale(150);
    setGrayscale(true);
    setBinarize(false);
    setThreshold(180);
    setRunning(false);
    setText("");
    setConfidence(null);
    setLog("");
  }

  async function runOcr() {
    if (!img) return;
    try {
      setRunning(true);
      setLog("Preprocessing image…");

      // 1) preprocess to an offscreen canvas
      const { canvas } = await preprocessImage({
        srcUrl: img.url,
        scalePct: Math.max(50, Math.min(400, scale)),
        grayscale,
        binarize,
        threshold,
      });

      setLog((s) => s + "\nRecognizing text (OCR) … (first run may take a few seconds)");

      // 2) run tesseract
      const { text, confidence } = await ocrWithTesseract(canvas, { lang, psm });

      setText(text.trim());
      setConfidence(confidence);
      setLog((s) => s + `\nDone. Confidence: ${confidence ? confidence.toFixed(1) : "—"}%`);
    } catch (e: any) {
      setLog((s) => s + `\nError: ${e?.message || String(e)}`);
    } finally {
      setRunning(false);
    }
  }

  function copyText() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    });
  }

  function downloadTxt() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ocr.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <>
      <ToolPageHeader
        icon={BookText}
        title="Image to Text (OCR)"
        description="Extract text from images (offline-capable). Works fully in your browser via WebAssembly."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            <ActionButton
              variant="default"
              label={running ? "Processing…" : "Run OCR"}
              icon={running ? Loader2 : BookText}
              onClick={runOcr}
              disabled={!img || running}
            />
          </>
        }
      />

      {/* Input / Preview */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Image</CardTitle>
          <CardDescription>Upload, drag & drop, or paste from clipboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <ImageDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            subtitle="PNG, JPEG, WEBP, GIF, SVG (GIF/SVG will be rasterized before OCR)"
          />

          <div className="grid gap-4">
            <ImagePreview
              url={img?.url}
              emptyNode={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  <ImageIcon className="mr-2 h-4 w-4" /> No image selected
                </div>
              }
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <InfoPill
                label="Source Size"
                value={img ? formatBytes(img.size ?? img.file.size) : "—"}
              />
              <InfoPill label="Source Type" value={img ? img.type || img.file.type || "—" : "—"} />
              <InfoPill label="Width" value={img ? `${img.width}px` : "—"} />
              <InfoPill label="Height" value={img ? `${img.height}px` : "—"} />
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator className="my-4" />

      {/* Settings */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
          <CardDescription>Language, page segmentation, and preprocessing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* OCR core */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={lang} onValueChange={(v) => setLang(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">English</SelectItem>
                  <SelectItem value="ben">Bengali (ben)</SelectItem>
                  <SelectItem value="hin">Hindi (hin)</SelectItem>
                  <SelectItem value="ara">Arabic (ara)</SelectItem>
                  <SelectItem value="fra">French (fra)</SelectItem>
                  <SelectItem value="spa">Spanish (spa)</SelectItem>
                  <SelectItem value="deu">German (deu)</SelectItem>
                  <SelectItem value="jpn">Japanese (jpn)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Extra languages are downloaded once and cached by the browser.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Page Segmentation Mode (PSM)</Label>
              <Select value={psm} onValueChange={(v: any) => setPsm(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="PSM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 — Fully automatic</SelectItem>
                  <SelectItem value="6">6 — Single uniform block</SelectItem>
                  <SelectItem value="7">7 — Single text line</SelectItem>
                  <SelectItem value="11">11 — Sparse text</SelectItem>
                  <SelectItem value="13">13 — Raw line</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preprocess */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Preprocessing
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Switch checked={grayscale} onCheckedChange={setGrayscale} id="grayscale" />
                  <Label htmlFor="grayscale">Grayscale</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={binarize} onCheckedChange={setBinarize} id="binarize" />
                  <Label htmlFor="binarize">Binarize</Label>
                </div>
              </div>
            </div>

            {binarize && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="th">Threshold</Label>
                  <span className="text-xs text-muted-foreground">{threshold}</span>
                </div>
                <Slider
                  id="th"
                  min={0}
                  max={255}
                  step={1}
                  value={[threshold]}
                  onValueChange={([v]) => setThreshold(v)}
                />
                <p className="text-xs text-muted-foreground">
                  Simple global threshold. For noisy scans, try 160–200.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="scale">Scale (%)</Label>
                <span className="text-xs text-muted-foreground">{scale}%</span>
              </div>
              <Slider
                id="scale"
                min={50}
                max={400}
                step={10}
                value={[scale]}
                onValueChange={([v]) => setScale(v)}
              />
              <p className="text-xs text-muted-foreground">
                Upscale small images for better OCR (100–200% works well).
              </p>
            </div>
          </div>
        </CardContent>
      </GlassCard>

      <Separator className="my-4" />

      {/* Output */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Recognized Text</CardTitle>
          <CardDescription>
            Copy or download the extracted text. Confidence shows overall quality.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[260px] font-mono"
              placeholder="Run OCR to see text…"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={copyText}
                disabled={!text}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={downloadTxt}
                disabled={!text}
              >
                <Download className="h-4 w-4" />
                Download .txt
              </Button>
              {confidence !== null && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Confidence: <b>{confidence.toFixed(1)}%</b>
                </span>
              )}
            </div>
          </div>

          <ProcessLog value={log} onClear={() => setLog("")} />
        </CardContent>
      </GlassCard>
    </>
  );
}

/* ---------------- helpers (local) ---------------- */

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Preprocess to improve OCR: optional grayscale / binarize + scaling */
async function preprocessImage(opts: {
  srcUrl: string;
  scalePct: number; // 50..400
  grayscale: boolean;
  binarize: boolean;
  threshold: number; // 0..255
}): Promise<{ canvas: HTMLCanvasElement }> {
  const { srcUrl, scalePct, grayscale, binarize, threshold } = opts;

  const img = await createImage(srcUrl);
  const targetW = Math.max(1, Math.round((img.naturalWidth * scalePct) / 100));
  const targetH = Math.max(1, Math.round((img.naturalHeight * scalePct) / 100));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  // High quality scaling where available
  (ctx as any).imageSmoothingEnabled = true;
  (ctx as any).imageSmoothingQuality = "high";

  ctx.drawImage(img, 0, 0, targetW, targetH);

  if (grayscale || binarize) {
    const imageData = ctx.getImageData(0, 0, targetW, targetH);
    const d = imageData.data;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2];
      // luminance
      let y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      if (binarize) {
        y = y >= threshold ? 255 : 0;
      }
      d[i] = d[i + 1] = d[i + 2] = y;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  return { canvas };
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

/** Tesseract.js OCR (lazy import) */
async function ocrWithTesseract(
  canvas: HTMLCanvasElement,
  opts: { lang: string; psm: string },
): Promise<OcrResult> {
  // Lazy-load to keep initial bundle smaller
  const Tesseract = await import("tesseract.js");

  // Simple one-shot API keeps code minimal
  const { data } = await Tesseract.recognize(canvas, opts.lang, {
    tessedit_pageseg_mode: opts.psm, // pass PSM
    // progress callback (optional): we append minimal dots
    logger: (m) => {
      // m.status, m.progress (0..1)
      // (No-op here to avoid extra re-renders)
    },
  });

  // Average confidence if present
  const conf =
    typeof data.confidence === "number"
      ? data.confidence
      : Array.isArray(data.words) && data.words.length
        ? avg(data.words.map((w: any) => w.confidence))
        : null;

  return { text: data.text || "", confidence: conf };
}

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
