// components/root/recept/order-receipt.tsx
"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";

export type OrderReceiptData = {
  orderNo: string;
  createdAt: string | Date;
  status: string;
  paymentMethod: string;
  currency?: string;
  subtotal: number | string;
  shippingTotal: number | string;
  total: number | string;

  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  orderNote?: string | null;
  referral?: string | null;

  items: Array<{
    id: string;
    title: string;
    qty: number;
    unitPrice: number | string;
    total: number | string;
    product?: {
      packageDuration?: string | null;
      images?: { url: string }[];
    } | null;
  }>;
};

const asNumber = (n: number | string | null | undefined) => {
  const x = typeof n === "string" ? Number(n) : Number(n ?? 0);
  return Number.isFinite(x) ? x : 0;
};
const moneyEn = (n: number | string | null | undefined) =>
  `BDT ${asNumber(n).toFixed(2)}`;

const payMethodLabel = (v?: string) => {
  const s = String(v ?? "COD").toUpperCase();
  if (s === "COD") return "Cash on Delivery";
  return s.charAt(0) + s.slice(1).toLowerCase();
};

export function OrderReceiptButton({ order }: { order: OrderReceiptData }) {
  const [PDF, setPDF] = useState<null | typeof import("@react-pdf/renderer")>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    import("@react-pdf/renderer")
      .then((m) => {
        if (!mounted) return;
        try {
          m.Font.register({
            family: "Noto Sans Bengali",
            fonts: [
              {
                src: "/fonts/NotoSansBengali-Regular.ttf",
                fontWeight: "normal",
              },
              {
                src: "/fonts/noto-sans-bengali/bold.ttf",
                fontWeight: "bold",
              },
            ],
          });
          m.Font.registerHyphenationCallback((word) => [word]);
        } catch {}
        setPDF(m);
      })
      .catch((err) =>
        logger.error(
          "react-pdf load error: " +
            (err instanceof Error ? err.message : String(err)),
        ),
      );
    return () => {
      mounted = false;
    };
  }, []);

  const styles = useMemo(() => {
    if (!PDF) return null;
    return PDF.StyleSheet.create({
      page: { padding: 24, fontFamily: "Noto Sans Bengali", fontSize: 12 },
      header: {
        marginBottom: 18,
        textAlign: "center",
        paddingBottom: 10,
        borderBottom: "2px dashed #333",
      },
      title: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
      subtitle: { fontSize: 12, color: "#555" },

      section: {
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: "2px dashed #333",
      },
      sectionTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 8 },

      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
      },
      label: { color: "#333", fontWeight: "bold", textTransform: "capitalize" },
      value: {
        fontWeight: "bold",
        textAlign: "right",
        textTransform: "none",
      },

      tableHeader: {
        flexDirection: "row",
        borderBottom: "1px solid #ddd",
        paddingVertical: 6,
        marginBottom: 4,
      },
      th: { fontSize: 11, fontWeight: "bold" },
      colName: { flex: 6 },
      colQty: { flex: 2, textAlign: "right" },
      colUnit: { flex: 2, textAlign: "right" },
      colLine: { flex: 2, textAlign: "right" },

      tableRow: {
        flexDirection: "row",
        paddingVertical: 4,
        borderBottom: "1px solid #f0f0f0",
      },
      td: { fontSize: 11 },

      footer: {
        marginTop: 18,
        textAlign: "center",
        fontSize: 10,
        fontWeight: "bold",
      },
    });
  }, [PDF]);

  const ready = !!PDF && !!styles;

  const renderDoc = () => {
    if (!PDF || !styles) return null;

    const { Document, Page, Text, View } = PDF;

    const dateStr = format(new Date(order.createdAt), "PPP p", {
      locale: enUS,
    }); // always English
    const subtotal = asNumber(order.subtotal);
    const shipping = asNumber(order.shippingTotal);
    const total = asNumber(order.total);

    const productLabel = (title: string, pkg?: string | null) =>
      pkg ? `${title} (${pkg})` : title;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ORDER RECEIPT</Text>
            <Text style={styles.subtitle}>
              Order No: {order.orderNo} • Date: {dateStr}
            </Text>
          </View>

          {/* Order Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Order No</Text>
              <Text style={styles.value}>{order.orderNo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{dateStr}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>
                {payMethodLabel(order.paymentMethod)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{String(order.status ?? "")}</Text>
            </View>
          </View>

          {/* Shipping */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{order.customerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{order.customerPhone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{order.shippingAddress}</Text>
            </View>
            {order.referral ? (
              <View style={styles.row}>
                <Text style={styles.label}>Referral</Text>
                <Text style={styles.value}>{order.referral}</Text>
              </View>
            ) : null}
            {order.orderNote ? (
              <View style={styles.row}>
                <Text style={styles.label}>Note</Text>
                <Text style={styles.value}>{order.orderNote}</Text>
              </View>
            ) : null}
          </View>

          {/* Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colName]}>Product</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colUnit]}>Unit</Text>
              <Text style={[styles.th, styles.colLine]}>Total</Text>
            </View>

            {/* Rows */}
            {order.items.map((it) => (
              <View key={it.id} style={styles.tableRow}>
                <Text style={[styles.td, styles.colName]}>
                  {productLabel(
                    it.title,
                    it.product?.packageDuration ?? undefined,
                  )}
                </Text>
                <Text style={[styles.td, styles.colQty]}>{it.qty}</Text>
                <Text style={[styles.td, styles.colUnit]}>
                  {moneyEn(it.unitPrice)}
                </Text>
                <Text style={[styles.td, styles.colLine]}>
                  {moneyEn(it.total)}
                </Text>
              </View>
            ))}

            {/* Totals */}
            <View style={{ marginTop: 8 }}>
              <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>{moneyEn(subtotal)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Shipping</Text>
                <Text style={styles.value}>{moneyEn(shipping)}</Text>
              </View>
              <View style={[styles.row, { marginTop: 4 }]}>
                <Text style={[styles.label, { fontSize: 13 }]}>Total</Text>
                <Text style={[styles.value, { fontSize: 13 }]}>
                  {moneyEn(total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This receipt has been generated by naturalsefa.com</Text>
          </View>
        </Page>
      </Document>
    );
  };

  if (!PDF) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Download className="mr-2 h-4 w-4" />
        Preparing…
      </Button>
    );
  }

  const { PDFDownloadLink } = PDF;

  return (
    <PDFDownloadLink
      document={renderDoc() ?? <PDF.Document />}
      fileName={`order-receipt-${order.orderNo}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <Button
          variant="outline"
          className="w-full"
          disabled={!ready || loading}
        >
          <Download className="mr-2 h-4 w-4" />
          {!ready
            ? "Preparing…"
            : loading
              ? "Generating PDF..."
              : "Download Receipt"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
