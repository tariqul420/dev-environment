"use client";

import { Download, Printer } from "lucide-react";
import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

/** Extend react-to-print options to include `content` for TS safety */
type UseReactToPrintPatched = Parameters<typeof useReactToPrint>[0] & {
  /** React-to-print expects a function returning a node or null */
  content?: () => HTMLElement | null;
};

type Props = {
  contentRef: React.RefObject<HTMLElement>;
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
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: fileName,
    removeAfterPrint: true,
  } as UseReactToPrintPatched);

  const saving = React.useRef(false);

  const handleSavePdf = async () => {
    if (!contentRef.current || saving.current) return;
    saving.current = true;
    try {
      // Dynamically import to avoid SSR issues and keep bundle light
      const mod = await import("html2pdf.js");
      // html2pdf.js exports a callable function; typings are loose so cast to any
      const html2pdf: any = (mod as any).default ?? (mod as any);

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
          },
          jsPDF: {
            unit: "mm",
            format: pageFormat,
            orientation: "portrait",
          },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(contentRef.current)
        .save();
    } finally {
      saving.current = false;
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Button variant={btnVariant} size={btnSize} onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" /> Print / System PDF
        </Button>
        <Button variant={btnVariant} size={btnSize} onClick={handleSavePdf} className="gap-2">
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
      @media print {
        .no-print,
        .print\\:hidden {
          display: none !important;
        }
        .print\\:bg-white {
          background: #ffffff !important;
        }
        .print\\:border-0 {
          border: 0 !important;
        }
        .print\\:shadow-none {
          box-shadow: none !important;
        }
      }
      .page-break-before {
        break-before: page;
      }
      .page-break-after {
        break-after: page;
      }
      .avoid-break-inside,
      .page-break-avoid {
        break-inside: avoid;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table {
          border-collapse: collapse;
        }
        th,
        td {
          page-break-inside: avoid;
        }
      }
    `}</style>
  );
}
