"use client";

import {
  Document,
  Font,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";
import { translateToEnglish } from "@/lib/utils/translator";

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

type Translated = {
  name: string;
  phone: string;
  address: string;
  items: Array<{ label: string }>;
};

const asNumber = (n: number | string | null | undefined) => {
  const x = typeof n === "string" ? Number(n) : Number(n ?? 0);
  return Number.isFinite(x) ? x : 0;
};

const bdt = (n: number | string | null | undefined) =>
  `BDT ${asNumber(n).toFixed(2)}`;

const bnToLatinDigits = (s: string) =>
  s.replace(/[০-৯]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x09e6 + 0x30),
  );

const payMethodLabel = (v?: string) => {
  const s = String(v ?? "COD").toUpperCase();
  if (s === "COD") return "Cash on Delivery";
  return s.charAt(0) + s.slice(1).toLowerCase();
};

Font.register({
  family: "Fira Code",
  fonts: [
    { src: "/fira-code/fira-code.ttf", fontWeight: "normal" },
    { src: "/fira-code/fira-code-bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: "Fira Code", fontSize: 12 },
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
    textTransform: "capitalize",
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

function ReceiptPDFDoc({
  order,
  t,
}: {
  order: OrderReceiptData;
  t: Translated;
}) {
  const subtotal = asNumber(order.subtotal);
  const shipping = asNumber(order.shippingTotal);
  const total = asNumber(order.total);
  const dateStr = format(new Date(order.createdAt), "PPP");

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
            <Text style={styles.value}>
              {String(order.status || "").toLowerCase()}
            </Text>
          </View>
        </View>

        {/* Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{t.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{t.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{t.address}</Text>
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
          {order.items.map((it, idx) => (
            <View key={it.id} style={styles.tableRow}>
              <Text style={[styles.td, styles.colName]}>
                {t.items[idx]?.label || it.title}
              </Text>
              <Text style={[styles.td, styles.colQty]}>{it.qty}</Text>
              <Text style={[styles.td, styles.colUnit]}>
                {bdt(it.unitPrice)}
              </Text>
              <Text style={[styles.td, styles.colLine]}>{bdt(it.total)}</Text>
            </View>
          ))}

          {/* Totals */}
          <View style={{ marginTop: 8 }}>
            <View style={styles.row}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>{bdt(subtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Shipping</Text>
              <Text style={styles.value}>{bdt(shipping)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 4 }]}>
              <Text style={[styles.label, { fontSize: 13 }]}>Total</Text>
              <Text style={[styles.value, { fontSize: 13 }]}>{bdt(total)}</Text>
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
}

export function OrderReceiptClient({ order }: { order: OrderReceiptData }) {
  const [t, setT] = useState<Translated | null>(null);

  const itemTitles = useMemo(
    () =>
      order.items.map((it) =>
        it.product?.packageDuration
          ? `${it.title} (${it.product.packageDuration})`
          : it.title,
      ),
    [order.items],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const name = await translateToEnglish(order.customerName);
        const address = await translateToEnglish(order.shippingAddress);

        const phone = bnToLatinDigits(order.customerPhone);

        const itemsTranslated = await Promise.all(
          itemTitles.map((lbl) => translateToEnglish(lbl)),
        );

        if (!mounted) return;
        setT({
          name,
          address,
          phone,
          items: itemsTranslated.map((label) => ({ label })),
        });
      } catch (err) {
        logger.error(
          "Receipt translate error: " +
            (err instanceof Error ? err.message : String(err)),
        );
        if (!mounted) return;
        setT({
          name: order.customerName,
          address: order.shippingAddress,
          phone: bnToLatinDigits(order.customerPhone),
          items: itemTitles.map((label) => ({ label })),
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [
    order.customerName,
    order.customerPhone,
    order.shippingAddress,
    itemTitles,
  ]);

  const ready = !!t;

  return (
    <PDFDownloadLink
      document={
        ready ? (
          <ReceiptPDFDoc order={order} t={t as Translated} />
        ) : (
          <Document />
        )
      }
      fileName={`order-receipt-${order.orderNo}.pdf`}
    >
      {({ loading }) => (
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
