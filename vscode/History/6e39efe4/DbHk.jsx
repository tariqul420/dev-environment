export const dynamic = "force-dynamic";

import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getPaymentById } from "@/lib/actions/payment.action";

function fmtAmount(n) {
  const v = Number(n || 0);
  return isFinite(v) ? v.toFixed(2) : "0.00";
}

function statusTone(status) {
  switch (status) {
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "failed":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "refunded":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "disputed":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export default async function PaymentDetailsPage({ params }) {
  const { id } = await params
  const payment = await getPaymentById(id);

  if (!payment) return notFound();

  const cur = payment.currency || "BDT";
  const paidLabel = payment.paidAt ? format(new Date(payment.paidAt), "PPpp") : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payment Details</h1>
          <p className="text-sm text-muted-foreground">
            ID: <span className="font-mono">{payment.id || payment._id}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/payments">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/admin/payments/${payment.id || payment._id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{payment.name || "—"}</CardTitle>
          <CardDescription className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {String(payment.paymentMethod || "—").replace("_", " ")}
            </Badge>
            <Badge variant="outline">Txn: {payment.transactionId || "—"}</Badge>
            <Badge variant="outline">Order: {payment.orderId || "—"}</Badge>
            <Badge variant="outline" className={`border px-1.5 py-1 capitalize ${statusTone(payment.status)}`}>
              {payment.status || "—"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="mt-1 font-semibold">
                {fmtAmount(payment.amount)} {cur}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Fees</div>
              <div className="mt-1 font-semibold">
                {fmtAmount(payment.fees)} {cur}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Net Amount</div>
              <div className="mt-1 font-semibold">
                {fmtAmount(payment.netAmount)} {cur}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Paid At" value={paidLabel} />
            <Field label="Account Number" value={payment.accountNumber || "—"} />
            <Field label="Reference" value={payment.reference || "—"} />
            <Field label="Payer Phone" value={payment.payerPhone || "—"} />
            <Field label="Payer Email" value={payment.payerEmail || "—"} />
            <Field label="Currency" value={payment.currency || "BDT"} />
            <Field label="Refunded?" value={payment.isRefund ? "Yes" : "No"} />
          </div>

          {payment.refundReason ? (
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Refund Reason</div>
              <div className="mt-1">{payment.refundReason}</div>
            </div>
          ) : null}

          {payment.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {payment.tags.map((t, i) => (
                <Badge key={i} variant="secondary" className="capitalize">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}

          {payment.notes ? (
            <div className="rounded-xl border p-3">
              <div className="text-xs text-muted-foreground">Notes</div>
              <div className="mt-1 whitespace-pre-wrap">{payment.notes}</div>
            </div>
          ) : null}

          {/* Receipts */}
          {payment.receipts?.length ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Receipts</div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {payment.receipts.map((src, i) => (
                  <a
                    key={i}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-lg border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`receipt-${i + 1}`}
                      className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
