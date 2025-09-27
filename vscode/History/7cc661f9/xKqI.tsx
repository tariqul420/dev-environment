"use client";

import { Download, Printer } from "lucide-react";
import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

type Props = {
  /** The DOM you want to print/save */
  contentRef: React.RefObject<HTMLElement>;
  /** File name for PDF download (no extension) */
  fileName?: string;
  /** A4 | Letter | Legal ... */
  pageFormat?: "a4" | "letter" | "legal" | string;
  /** mm or number[] accepted by html2pdf margin */
  margin?: number | [number, number] | [number, number, number, number];
  /** Increase for sharper output (2–3 good range) */
  scale?: number;
  /** Optional: extra buttons/actions on the right side */
  extraActions?: React.ReactNode;
  /** Button size & variant pass-throughs if you want */
  btnSize?: "default" | "sm" | "lg" | "icon";
  btnVariant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  className?: string;
};

/**
 * PrintSaveBar
 * - Print only the node inside contentRef (react-to-print)
 * - Save as PDF via html2pdf.js (client-only, dynamic import)
 * Drop this above or below your preview block.
 */
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
    // copyStyles helps preserve Tailwind styles
    removeAfterPrint: true,
  });

  const saving = React.useRef(false);

  const handleSavePdf = async () => {
    if (!contentRef.current || saving.current) return;
    saving.current = true;
    try {
      // dynamic import to avoid SSR issues
      const mod = await import("html2pdf.js");
      const html2pdf = (mod as any).default || (mod as any);

      await html2pdf()
        .set({
          margin,
          filename: `${fileName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale,
            useCORS: true,
            logging: false,
            // helpful to keep fonts crisp
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

/**
 * Global print helpers: page breaks, hide “no-print”, improve contrast.
 * Drop <PrintStyles/> once at layout root or inside pages that need printing.
 */
export function PrintStyles() {
  return (
    <style jsx global>{`
      /* Hide controls when printing */
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

      /* Page-break utilities */
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

      /* Improve text rendering in print */
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
