'use client';

import { QrECL } from '@/components/shared/qr-code';
import QRCode from 'qrcode';

type BaseOpts = {
  value: string;
  size: number;
  margin: number;
  ecl: QrECL;
  fg: string;
  bg: string;
  quietZone?: boolean; // default true
  // optional logo overlay (PNG export only)
  logo?: { src: string; sizePct?: number; roundedPct?: number; pad?: number } | null;
};

export function useQrExport(base: BaseOpts) {
  const makeOpts = (w: number) => ({
    width: w,
    margin: base.quietZone === false ? 0 : base.margin,
    errorCorrectionLevel: base.ecl,
    color: { dark: base.fg, light: base.bg },
  });

  const getPngDataUrl = async (scale = 2) => {
    const px = Math.max(64, Math.min(4096, base.size * scale));
    const c = document.createElement('canvas');
    await QRCode.toCanvas(c, base.value || 'Scan me', makeOpts(px));
    if (base.logo?.src) {
      await overlayLogo(c, {
        src: base.logo.src,
        sizePct: base.logo.sizePct ?? 20,
        roundedPct: base.logo.roundedPct ?? 20,
        pad: base.logo.pad ?? 4,
      });
    }
    return c.toDataURL('image/png');
  };

  const downloadPNG = async (filename = 'qrcode.png', scale = 2) => {
    const url = await getPngDataUrl(scale);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const getSvgText = async () => {
    const svg = await QRCode.toString(base.value || 'Scan me', {
      ...makeOpts(base.size),
      type: 'svg',
    });
    return svg;
  };

  const downloadSVG = async (filename = 'qrcode.svg') => {
    const svg = await getSvgText();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const copyPngDataUrl = async (scale = 2) => {
    const url = await getPngDataUrl(scale);
    await navigator.clipboard.writeText(url);
  };

  return { getPngDataUrl, downloadPNG, getSvgText, downloadSVG, copyPngDataUrl };
}

/* reuse overlay from the other file (inline copy here for isolation) */
async function overlayLogo(canvas: HTMLCanvasElement, cfg: { src: string; sizePct: number; roundedPct: number; pad: number }) {
  return new Promise<void>((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.round((Math.min(w, h) * cfg.sizePct) / 100);
      const x = Math.round(w / 2 - size / 2);
      const y = Math.round(h / 2 - size / 2);
      const r = Math.round((size * cfg.roundedPct) / 100);

      const bgX = x - cfg.pad;
      const bgY = y - cfg.pad;
      const bgW = size + cfg.pad * 2;
      const bgH = size + cfg.pad * 2;

      roundedRect(ctx, bgX, bgY, bgW, bgH, r);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.drawImage(img, x, y, size, size);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = cfg.src;
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
