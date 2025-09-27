"use client";

import { Download, Printer } from "lucide-react";
import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

/** Extend react-to-print options to include `content` for TS safety */
type UseReactToPrintPatched = Parameters<typeof useReactToPrint>[0] & {
  content?: () => HTMLElement | null;
};

/** Accept both RefObject and MutableRefObject, and allow null inside. */
type ContentRef = React.RefObject<HTMLElement | null> | React.MutableRefObject<HTMLElement | null>;

type Props = {
  contentRef: ContentRef;
  fileName?: string;
  pageFormat?: "a4" | "letter" | "legal" | string;
  margin?: number | [number, number] | [number, number, number, number];
  scale?: number;
  extraActions?: React.ReactNode;
  btnSize?: "default" | "sm" | "lg" | "icon";
  btnVariant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  className?: string;
};

export function PrintSaveBar({
  contentRef,
  fileName = "document",
  pageFormat = "a4",
  margin = [12, 12, 12, 12],
  scale = 2,
  extraActions,
  btnSize = "default",
  btnVariant = "outline",
  className,
}: Props) {
  const getNode = React.useCallback(
    () => (contentRef?.current as HTMLElement | null) ?? null,
    [contentRef],
  );

  const handlePrint = useReactToPrint({
    content: getNode,
    documentTitle: fileName,
    removeAfterPrint: true,
  } as UseReactToPrintPatched);

  const saving = React.useRef(false);

  const handleSavePdf = async () => {
    const node = getNode();
    if (!node || saving.current) return;
    saving.current = true;

    // Add the override class to avoid 'lab()' etc.
    node.classList.add("pdf-capture");
    try {
      const mod = await import("html2pdf.js");
      const html2pdf = mod.default ?? mod;

      await html2pdf()
        .set({
          margin,
          filename: `${fileName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale,
            useCORS: true,
            logging: false,
            letterRendering: true,
            // Important: tells html2canvas to prefer computed styles,
            // with our .pdf-capture overrides in place.
            backgroundColor: "#ffffff",
          },
          jsPDF: { unit: "mm", format: pageFormat, orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(node)
        .save();
    } catch (err) {
      console.error("PDF export failed:", err);
      // Fallback: open system print (always works & stays vector)
      handlePrint?.();
    } finally {
      node.classList.remove("pdf-capture");
      saving.current = false;
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Button
          variant={btnVariant}
          size={btnSize}
          onClick={handlePrint}
          className="gap-2"
          type="button"
        >
          <Printer className="h-4 w-4" /> Print / System PDF
        </Button>
        <Button
          variant={btnVariant}
          size={btnSize}
          onClick={handleSavePdf}
          className="gap-2"
          type="button"
        >
          <Download className="h-4 w-4" /> Save PDF (Client)
        </Button>
        {extraActions}
      </div>
    </div>
  );
}

export function PrintStyles() {
  return (
    <style jsx global>{`
      /* ... your existing print css ... */

      /* Force legacy, sRGB-safe colors during PDF capture */
      .pdf-capture,
      .pdf-capture * {
        /* text & bg */
        color: #0a0a0a !important;
        background: transparent !important;
        background-color: #ffffff !important;

        /* borders & separators */
        border-color: #e5e7eb !important; /* tailwind gray-200 */

        /* shadows usually rasterize poorly; strip them */
        box-shadow: none !important;

        /* gradients & fancy color funcs → avoid */
        background-image: none !important;
      }

      /* Tables look cleaner with solid borders when rasterized */
      .pdf-capture table {
        border-collapse: collapse !important;
      }
      .pdf-capture th,
      .pdf-capture td {
        border: 1px solid #e5e7eb !important;
      }
    `}</style>
  );
}
