"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { CheckboxField } from "@/components/globals/form-field/checkbox-field";
import ImageUploaderField from "@/components/globals/form-field/image-uploader-field";
import { InputField } from "@/components/globals/form-field/input-field";
import SelectField from "@/components/globals/form-field/select-field";
import TextareaField from "@/components/globals/form-field/textarea-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createPayment, updatePayment } from "@/lib/actions/payment.action";

/* Zod Schema */
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  paymentMethod: z.enum(
    [
      "bkash",
      "nagad",
      "rocket",
      "upay",
      "bank_transfer",
      "card",
      "paypal",
      "stripe",
      "cod",
      "other",
    ],
    { required_error: "Payment method is required" }
  ),
  accountNumber: z.string().min(3, "Account number is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.enum(["BDT", "USD", "EUR", "INR", "GBP"]).default("BDT"),
  fees: z.coerce.number().min(0, "Fees cannot be negative").default(0),
  transactionId: z.string().optional(),
  reference: z.string().optional(),
  paidAt: z.string().min(1, "Date & time is required"), // datetime-local
  status: z
    .enum(["pending", "success", "failed", "refunded", "disputed"])
    .default("pending"),
  payerPhone: z.string().optional(),
  payerEmail: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
  orderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isRefund: z.boolean().optional(),
  refundReason: z.string().optional(),
  receipts: z.array(z.string().url()).optional(),
});

/* UI Data */
const methodOptions = [
  { label: "bKash", value: "bkash" },
  { label: "Nagad", value: "nagad" },
  { label: "Rocket", value: "rocket" },
  { label: "Upay", value: "upay" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Card", value: "card" },
  { label: "PayPal", value: "paypal" },
  { label: "Stripe", value: "stripe" },
  { label: "Cash on Delivery (COD)", value: "cod" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
  { label: "Disputed", value: "disputed" },
];

const currencyOptions = [
  { label: "BDT (৳)", value: "BDT" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "INR (₹)", value: "INR" },
  { label: "GBP (£)", value: "GBP" },
];

/* PaymentForm */
export default function PaymentForm({ payment }) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: payment?.name ?? "",
      paymentMethod: payment?.paymentMethod ?? "bkash",
      accountNumber: payment?.accountNumber ?? "",
      amount: payment?.amount ?? 0,
      currency: payment?.currency ?? "BDT",
      fees: payment?.fees ?? 0,
      transactionId: payment?.transactionId ?? "",
      reference: payment?.reference ?? "",
      paidAt: payment?.paidAt
        ? new Date(payment.paidAt).toISOString().slice(0, 16) 
        : "",
      status: payment?.status ?? "pending",
      payerPhone: payment?.payerPhone ?? "",
      payerEmail: payment?.payerEmail ?? "",
      orderId: payment?.orderId ?? "",
      tags: payment?.tags ?? [],
      notes: payment?.notes ?? "",
      isRefund: payment?.isRefund ?? false,
      refundReason: payment?.refundReason ?? "",
      receipts: payment?.receipts ?? [],
    },
  });

  const { handleSubmit, formState, setValue } = form;

  const amount = form.watch("amount");
  const fees = form.watch("fees");
  const currency = form.watch("currency");
  const netAmountLive = (Number(amount) || 0) - (Number(fees) || 0);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      netAmount: Number(values.amount) - Number(values.fees || 0),
      paidAt: new Date(values.paidAt),
    };

    toast.promise(
      payment
        ? updatePayment({ paymentId: payment._id, data: payload, path: pathname })
        : createPayment({ data: payload, path: pathname }),
      {
        loading: payment ? "Updating payment..." : "Creating payment...",
        success: () => {
          router.refresh();
          if (!payment) router.push("/admin/payments");
          return payment ? "Payment updated!" : "Payment created!";
        },
        error: "Something went wrong!",
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Payer & Payment basics */}
        <InputField name="name" label="Payer Name" placeholder="e.g., Md. Tariqul Islam" />
        <SelectField
          name="paymentMethod"
          label="Payment Method"
          placeholder="Select method"
          options={methodOptions}
        />

        <InputField
          name="accountNumber"
          label="Account Number"
          placeholder="e.g., bKash/Nagad/Bank A/C"
        />
        <InputField name="transactionId" label="Transaction ID (optional)" />
        <InputField name="reference" label="Reference/Memo (optional)" />

        <InputField
          name="paidAt"
          label="Date & Time"
          type="datetime-local"
          hint="Payment date and time"
        />

        {/* Amounts */}
        <InputField name="amount" label="Amount" type="number" step="0.01" />
        <SelectField
          name="currency"
          label="Currency"
          placeholder="Select currency"
          options={currencyOptions}
        />
        <InputField name="fees" label="Fees (optional)" type="number" step="0.01" />

        {/* Live net preview (not registered with RHF to avoid validation) */}
        <div className="flex items-end gap-2 sm:col-span-2">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium">Net Amount (auto)</div>
            <div className="mt-1">
              {isFinite(netAmountLive) ? netAmountLive.toFixed(2) : "0.00"} {currency || "BDT"}
            </div>
          </div>
        </div>

        {/* Status & links */}
        <SelectField
          name="status"
          label="Status"
          placeholder="Select status"
          options={statusOptions}
        />
        <InputField name="orderId" label="Order ID (optional)" />
        <InputField name="payerPhone" label="Payer Phone (optional)" placeholder="+8801XXXXXXXXX" />
        <InputField name="payerEmail" label="Payer Email (optional)" type="email" />

        {/* Tags as CSV -> array */}
        <InputField
          name="tags"
          label="Tags (comma separated)"
          placeholder="e.g., subscription, renewal, wholesale"
          onChange={(e) =>
            setValue(
              "tags",
              String(e.target.value)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
        />

        {/* Receipts / Proof */}
        <ImageUploaderField
          name="receipts"
          label="Receipt / Proof Images"
          multiple
          className="sm:col-span-2"
          viewClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        />

        <TextareaField
          name="notes"
          label="Notes"
          placeholder="Any additional details…"
          minHeight="min-h-[160px]"
          className="sm:col-span-2"
        />

        <CheckboxField name="isRefund" label="Is Refunded?" />
        <TextareaField
          name="refundReason"
          label="Refund Reason (optional)"
          placeholder="Why was the payment refunded?"
          className="sm:col-span-2"
        />

        <Button
          type="submit"
          disabled={!form.formState.isDirty || formState.isSubmitting}
          className="sm:col-span-2"
        >
          {payment ? "Update Payment" : "Create Payment"}
        </Button>
      </form>
    </Form>
  );
}
