"use client";

import { translateToEnglish } from "@/components/global/translator";
import { event } from "@/lib/gtag";
import logger from "@/lib/logger";
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
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

// Register the font
Font.register({
  family: "Fira Code",
  fonts: [
    { src: "/fira-code/fira-code.ttf", fontWeight: "normal" },
    { src: "/fira-code/fira-code-bold.ttf", fontWeight: "bold" },
  ],
});

interface OrderData {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  quantity: number;
  product: {
    title: string;
    salePrice: number;
    packageDuration?: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Fira Code",
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 10,
    borderBottom: "2px dashed #333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: "2px dashed #333",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    color: "#333",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  value: {
    fontWeight: "bold",
    textAlign: "right",
    textTransform: "capitalize",
  },
  divider: {
    borderBottom: "2px dashed #333",
    marginVertical: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  viewer: {
    width: "100%",
    height: "80vh",
    border: "1px solid #ccc",
  },
});

export const ReceiptPDF = ({
  order,
  translations,
}: {
  order: OrderData;
  translations: {
    name: string;
    address: string;
    package: string;
    phone: string;
  };
}) => {
  const subtotal = order.product.salePrice * order.quantity;
  const shipping = 0;
  const total = subtotal + shipping;
  const paymentDate = format(new Date(order.createdAt), "PPP");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ORDER RECEIPT</Text>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{order.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{paymentDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>Cash on Delivery</Text>
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{translations.name || order.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>
              {translations.phone || order.phone}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {translations.address || order.address}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Product</Text>
            <Text style={styles.value}>
              {order.product.title}
              {translations.package && ` (${translations.package})`} x{" "}
              {order.quantity}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Unit Price</Text>
            <Text style={styles.value}>
              BDT {order.product.salePrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>BDT {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>BDT {shipping.toFixed(2)}</Text>
          </View>
          <View
            style={[
              styles.row,
              styles.divider,
              { marginBottom: 0, paddingBottom: 0 },
            ]}
          />
          <View style={styles.row}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>BDT {total.toFixed(2)}</Text>
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

export function OrderReceipt({ order }: { order: OrderData }) {
  const [translations, setTranslations] = useState({
    name: "",
    address: "",
    package: "",
    phone: "",
  });

  useEffect(() => {
    const translateText = async () => {
      try {
        const formattedPhone = order.phone.replace(/[০-৯]/g, (d) => {
          return String.fromCharCode(d.charCodeAt(0) - 0x09e6 + 0x30);
        });

        const [nameTranslation, addressTranslation, packageTranslation] =
          await Promise.all([
            translateToEnglish(order.name),
            translateToEnglish(order.address),
            order.product.packageDuration
              ? translateToEnglish(order.product.packageDuration)
              : "",
          ]);

        setTranslations({
          name: nameTranslation,
          address: addressTranslation,
          package: packageTranslation,
          phone: formattedPhone,
        });
      } catch (error) {
        logger.error("Translation error:", error);
        setTranslations({
          name: order.name,
          address: order.address,
          package: order.product.packageDuration || "",
          phone: order.phone,
        });
      }
    };

    translateText();
  }, [order]);

  return (
    <PDFDownloadLink
      document={<ReceiptPDF order={order} translations={translations} />}
      onClick={() => {
        // ✅ Google Analytics
        event({
          action: "receipt_downloaded",
          category: "Order",
          label: `Order ID: ${order.orderId}`,
        });

        // ✅ Facebook Pixel
        if (typeof window !== "undefined" && typeof window.fbq === "function") {
          window.fbq("trackCustom", "ReceiptDownloaded", {
            orderId: order.orderId,
            value: order.product.salePrice * order.quantity,
            currency: "BDT",
          });
        }

        // ✅ TikTok Pixel
        if (typeof window !== "undefined" && typeof window.ttq === "object") {
          window.ttq.track("Download", {
            event_name: "ReceiptDownloaded",
            order_id: order.orderId,
            value: order.product.salePrice * order.quantity,
            currency: "BDT",
          });
        }
      }}
      fileName={`order-receipt-${order.orderId}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" className="w-full" disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? "Generating PDF..." : "Download Receipt"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
