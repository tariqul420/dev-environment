"use client";

import {
  ActivitySquare,
  Check,
  Copy,
  Crop,
  CloudDownload,
  Eye,
  Image as ImageIcon,
  ImageDown,
  Link2,
  Loader2,
  Palette,
  RotateCcw,
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
import { cn } from "@/lib/utils";

/* ------------------- types ------------------- */
type FitMode = "contain" | "cover";
type OutFormat = "keep" | "jpeg" | "png" | "webp";

interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
  type: string;
  size: number;
}

/* ------------------- page ------------------- */
export default function ImageCompressPage() {
  const [img, setImg] = React.useState<LoadedImage | null>(null);

  // Resize controls
  const [locked, setLocked] = React.useState(true);
  const [fit, setFit] = React.useState<FitMode>("contain");
  const [scale, setScale] = React.useState<number | "">("");
  const [w, setW] = React.useState<number | "">("");
  const [h, setH] = React.useState<number | "">("");

  // Format/quality
  const [fmt, setFmt] = React.useState<OutFormat>("keep");
  const [quality, setQuality] = React.useState(80);
  const [bg, setBg] = React.useState("#ffffff");

  // Target size
  const [targetSize, setTargetSize] = React.useState<number | "">("");
  const [sizeUnit, setSizeUnit] = React.useState<"KB" | "MB">("KB");

  // UI
  const [running, setRunning] = React.useState(false);
  const [log, setLog] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // ✅ new state for preview
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const ratio = React.useMemo(() => (img ? img.width / img.height : 1), [img]);

  const onDrop = React.useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const meta = await loadImageMeta(url);
    setImg({
      file,
      url,
      width: meta.width,
      height: meta.height,
      type: file.type,
      size: file.size,
    });
    setW(meta.width);
    setH(meta.height);
    setScale("");
    setFmt("keep");
    setQuality(80);
    setTargetSize("");
    setLog(`Loaded ${file.name} (${formatBytes(file.size)})`);
    setPreviewUrl(null);
  }, []);

  React.useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const item = e.clipboardData?.files?.[0];
      if (item?.type.startsWith("image/")) onDrop([item]);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop,
  });

  // aspect lock
  React.useEffect(() => {
    if (!img) return;
    if (locked && typeof w === "number" && document.activeElement?.id === "width") {
      setH(Math.max(1, Math.round(w / ratio)));
    }
    if (locked && typeof h === "number" && document.activeElement?.id === "height") {
      setW(Math.max(1, Math.round(h * ratio)));
    }
  }, [w, h, ratio, locked, img]);

  // scale → w/h
  React.useEffect(() => {
    if (!img) return;
    if (scale === "" || Number.isNaN(Number(scale))) return;
    const s = Math.max(1, Number(scale));
    setW(Math.max(1, Math.round((img.width * s) / 100)));
    setH(Math.max(1, Math.round((img.height * s) / 100)));
  }, [scale, img]);

  function resetAll() {
    if (img?.url) URL.revokeObjectURL(img.url);
    setImg(null);
    setLocked(true);
    setFit("contain");
    setScale("");
    setW("");
    setH("");
    setFmt("keep");
    setQuality(80);
    setBg("#ffffff");
    setTargetSize("");
    setSizeUnit("KB");
    setRunning(false);
    setLog("");
    setPreviewUrl(null);
  }

  async function run(download = true) {
    if (!img) return;

    try {
      setRunning(true);
      setLog(download ? "Compressing…" : "Generating preview…");

      const actualFmt: Exclude<OutFormat, "keep"> = fmt === "keep" ? mimeToFmt(img.type) : fmt;
      const outW = typeof w === "number" ? w : img.width;
      const outH = typeof h === "number" ? h : img.height;
      const tgtBytes =
        targetSize === ""
          ? undefined
          : Math.max(1, Number(targetSize)) * (sizeUnit === "MB" ? 1024 * 1024 : 1024);

      const { blob } = await compress({
        srcUrl: img.url,
        srcW: img.width,
        srcH: img.height,
        outW,
        outH,
        fit,
        format: actualFmt,
        quality,
        background: bg,
        targetBytes: tgtBytes,
      });

      if (download) {
        const filename = suggestName(img.file.name, actualFmt);
        triggerDownload(blob, filename);
        setLog(
          `Done → ${filename} (${formatBytes(blob.size)}).${
            tgtBytes ? ` Target was ≤ ${formatBytes(tgtBytes)}.` : ""
          }`,
        );
      } else {
        // preview
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setLog(`Preview generated (${formatBytes(blob.size)})`);
      }
    } catch (e: any) {
      setLog(`Error: ${e?.message || String(e)}`);
    } finally {
      setRunning(false);
    }
  }

  const lossy = fmt === "keep" && img ? !img.type.includes("png") : fmt !== "png";

  return (
    <>
      <ToolPageHeader
        icon={ImageDown}
        title="Image Compress"
        description="Shrink images for web & social. Drag & drop, paste (Ctrl/Cmd+V), or upload."
        actions={
          <>
            <ResetButton onClick={resetAll} />
            {/* 👁️ New Preview Button */}
            <ActionButton
              variant="outline"
              label={running ? "…" : "Preview"}
              icon={Eye}
              onClick={() => run(false)}
              disabled={!img || running}
            />
            <ActionButton
              variant="default"
              label={running ? "Processing…" : "Compress & Download"}
              icon={running ? Loader2 : CloudDownload}
              onClick={() => run(true)}
              disabled={!img || running}
            />
          </>
        }
      />

      {/* uploader, settings ... unchanged ... */}

      <Separator className="my-4" />

      {/* Output & Log */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Output & Log</CardTitle>
          <CardDescription>
            {previewUrl ? "Preview generated below." : "Click Compress or Preview."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <ActivitySquare className="h-4 w-4" />
                  Target Dimensions
                </span>
                <span className="font-medium">
                  {typeof w === "number" && typeof h === "number" ? `${w} × ${h}px` : "—"}
                </span>
              </div>
              {previewUrl && (
                <div className="mt-3 overflow-hidden rounded border">
                  <img src={previewUrl} alt="preview" className="w-full object-contain" />
                </div>
              )}
            </div>
          </div>
          <ProcessLog value={log} onClear={() => setLog("")} />
        </CardContent>
      </GlassCard>
    </>
  );
}

/* ------------------- helpers (same as before) ------------------- */
// ... numOrEmpty, mimeToFmt, suggestName, triggerDownload, formatBytes, loadImageMeta, compress, drawCanvas, etc

/* ------------------- helpers ------------------- */

function numOrEmpty(v: string): number | "" {
  const n = Number(v);
  return Number.isNaN(n) ? "" : n;
}

function mimeToFmt(mime: string): Exclude<OutFormat, "keep"> {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpeg";
}

function suggestName(name: string, fmt: Exclude<OutFormat, "keep">) {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base}-compressed.${fmt === "jpeg" ? "jpg" : fmt}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

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

function loadImageMeta(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

async function compress(opts: {
  srcUrl: string;
  srcW: number;
  srcH: number;
  outW: number;
  outH: number;
  fit: FitMode;
  format: Exclude<OutFormat, "keep">;
  quality: number; // 1..100
  background: string;
  targetBytes?: number;
}): Promise<{ blob: Blob }> {
  const { srcUrl, srcW, srcH, outW, outH, fit, format, quality, background, targetBytes } = opts;

  // prepare canvas with draw (contain/cover)
  const { canvas } = await drawCanvas({
    srcUrl,
    srcW,
    srcH,
    outW,
    outH,
    fit,
    format,
    background,
  });

  const mime = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
  const q = Math.min(1, Math.max(0.01, quality / 100));

  // If targetBytes requested and lossy format → binary search on quality
  if (targetBytes && format !== "png") {
    const blob = await toTargetSize(canvas, mime, targetBytes, q);
    return { blob };
  }

  // Single encode
  const blob = await canvasToBlob(canvas, mime, q);
  return { blob };
}

async function drawCanvas(opts: {
  srcUrl: string;
  srcW: number;
  srcH: number;
  outW: number;
  outH: number;
  fit: FitMode;
  format: Exclude<OutFormat, "keep">;
  background: string;
}): Promise<{ canvas: HTMLCanvasElement }> {
  const { srcUrl, srcW, srcH, outW, outH, fit, format, background } = opts;

  const targetW = Math.max(1, Math.round(outW));
  const targetH = Math.max(1, Math.round(outH));

  const srcAspect = srcW / srcH;
  const dstAspect = targetW / targetH;

  let drawW = targetW;
  let drawH = targetH;

  if (fit === "contain") {
    if (srcAspect > dstAspect) {
      drawW = targetW;
      drawH = Math.round(targetW / srcAspect);
    } else {
      drawH = targetH;
      drawW = Math.round(targetH * srcAspect);
    }
  } else {
    if (srcAspect > dstAspect) {
      drawH = targetH;
      drawW = Math.round(targetH * srcAspect);
    } else {
      drawW = targetW;
      drawH = Math.round(targetW / srcAspect);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  // JPEG needs background to replace transparency; also used when contain pads
  if (format === "jpeg") {
    ctx.fillStyle = background || "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  } else {
    ctx.clearRect(0, 0, targetW, targetH);
  }

  const imgEl = await createImageElement(srcUrl);

  if (fit === "contain") {
    const dx = Math.round((targetW - drawW) / 2);
    const dy = Math.round((targetH - drawH) / 2);
    ctx.drawImage(imgEl, 0, 0, srcW, srcH, dx, dy, drawW, drawH);
  } else {
    const scale = Math.max(targetW / srcW, targetH / srcH);
    const sw = Math.round(targetW / scale);
    const sh = Math.round(targetH / scale);
    const sx = Math.round((srcW - sw) / 2);
    const sy = Math.round((srcH - sh) / 2);
    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, targetW, targetH);
  }

  return { canvas };
}

function createImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, q: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))), mime, q);
  });
}

async function toTargetSize(
  canvas: HTMLCanvasElement,
  mime: string,
  targetBytes: number,
  initialQ: number,
): Promise<Blob> {
  let lo = 0.05;
  let hi = 1.0;
  let best: Blob | null = null;

  // Start near the requested quality
  let q = Math.max(lo, Math.min(hi, initialQ));

  for (let i = 0; i < 8; i++) {
    const blob = await canvasToBlob(canvas, mime, q);
    if (blob.size <= targetBytes) {
      best = blob; // hit target — try higher quality under the cap
      lo = q;
      q = (q + hi) / 2;
    } else {
      hi = q;
      q = (q + lo) / 2;
    }
  }

  if (best) return best;

  // If never under target, return smallest bound
  return canvasToBlob(canvas, mime, lo);
}
