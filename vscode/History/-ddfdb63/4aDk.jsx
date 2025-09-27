"use client";

import ImageUploaderField from "@/components/globals/form-field/image-uploader-field";
import { InputField } from "@/components/globals/form-field/input-field";
import MultiSelectField from "@/components/globals/form-field/multi-select-field";
import SelectField from "@/components/globals/form-field/select-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  referenceHolder: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional(),

  dlReferenceNumber: z.string().optional(),
  dlDateOfBirth: z.coerce.date().optional(),
  nidDateOfBirth: z.coerce.date().optional(),

  typesOfWork: z.string().min(1, "Types of work is required"),
  workingCondition: z.enum(["Normal Process", "Emerjency Process"], {
    required_error: "Working condition is required",
  }),

  paymentStatus: z.enum(["paid", "unpaid"]).default("unpaid"),

  // Coerce number but allow empty -> undefined
  agreementOfAmount: z
    .preprocess(
      (v) =>
        v === "" || v === null || v === undefined ? undefined : Number(v),
      z
        .number({ invalid_type_error: "Amount must be a number" })
        .positive("Amount must be greater than 0")
        .optional(),
    )
    .refine(
      (val, ctx) => {
        if (
          ctx.parent.paymentStatus === "paid" &&
          (val === undefined || val === null)
        ) {
          return false;
        }
        return true;
      },
      { message: "Amount is required when payment status is paid" },
    ),

  // File URL fields
  nid: z.string().url().optional(),
  certificate: z.string().url().optional(),
  drivingLicence: z.string().url().optional(),
  utilityBill: z.string().url().optional(),
  medicalReport: z.string().url().optional(),
  doopTestReport: z.string().url().optional(),
  visa: z.string().url().optional(),
  passport: z.string().url().optional(),
  ticket: z.string().url().optional(),
});

export default function ServiceForm({ service }) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name || "",
      referenceHolder: service?.referenceHolder || "",
      phone: service?.phone || "",
      email: service?.email || "",

      dlReferenceNumber: service?.dlReferenceNumber || "",
      dlDateOfBirth: service?.dlDateOfBirth
        ? new Date(service.dlDateOfBirth)
        : undefined,
      nidDateOfBirth: service?.nidDateOfBirth
        ? new Date(service.nidDateOfBirth)
        : undefined,

      typesOfWork: service?.typesOfWork || "",
      workingCondition: service?.workingCondition || "Normal Process",

      paymentStatus: service?.paymentStatus || "unpaid",
      agreementOfAmount:
        service?.agreementOfAmount === undefined ||
        service?.agreementOfAmount === null
          ? undefined
          : Number(service.agreementOfAmount),

      nid: service?.nid || "",
      certificate: service?.certificate || "",
      drivingLicence: service?.drivingLicence || "",
      utilityBill: service?.utilityBill || "",
      medicalReport: service?.medicalReport || "",
      doopTestReport: service?.doopTestReport || "",
      visa: service?.visa || "",
      passport: service?.passport || "",
      ticket: service?.ticket || "",
    },
  });
  const { handleSubmit, watch, setValue, formState } = form;
  const paymentStatus = watch("paymentStatus");

  // Auto-clear amount when unpaid
  useEffect(() => {
    if (paymentStatus === "unpaid") {
      setValue("agreementOfAmount", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [paymentStatus, setValue]);

  const onSubmit = async (values) => {
    // Replace with your server action / API call
    console.log("Submitting BRTA service:", values);
    // await upsertBrtaService(values);
    // router.push("/admin/brta"); // example
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        <InputField name="name" label="Name (As per your NID)" />
        <InputField name="referenceHolder" label="Reference Holder" />
        <InputField name="phone" label="Phone" type="tel" />
        <InputField name="email" label="Email" type="email" />

        <InputField name="dlReferenceNumber" label="DL Reference Number" />
        <InputField name="dlDateOfBirth" label="DL Date Of Birth" type="date" />
        <InputField
          name="nidDateOfBirth"
          label="NID Date Of Birth"
          type="date"
        />

        {/* Types of work */}
        <MultiSelectField
          name="typesOfWork"
          label="Types of Work"
          placeholder="Select type(s)"
          options={[
            { label: "Learner", value: "Learner" },
            { label: "Correction", value: "Correction" },
            { label: "Vehicle Addition", value: "Vehicle Addition" },
            { label: "Nobayon", value: "Nobayon" },
            { label: "Exam Date Change", value: "Exam Date Change" },
            { label: "Delete Licence", value: "Delete Licence" },
            { label: "Help For Exam Passed", value: "Help For Exam Passed" },
            { label: "Emerjency Smart Card", value: "Emerjency Smart Card" },
            { label: "New Date For Exam", value: "New Date For Exam" },
            { label: "Other", value: "Other" },
          ]}
        />

        {/* Working condition */}
        <SelectField
          name="workingCondition"
          label="Working Condition"
          placeholder="Select Working Condition"
          options={[
            { label: "Normal Process", value: "Normal Process" },
            { label: "Emerjency Process", value: "Emerjency Process" },
          ]}
        />

        <div className="flex gap-4">
          {/* Payment */}
          <SelectField
            className="w-fit"
            name="paymentStatus"
            label="Payment Status"
            placeholder="Select status"
            options={[
              { label: "Unpaid", value: "unpaid" },
              { label: "Paid", value: "paid" },
            ]}
          />

          <InputField
            className="w-full"
            name="agreementOfAmount"
            label="Amount (BDT)"
            type="number"
            placeholder="0"
            inputProps={{ min: 1, step: "1" }}
          />
        </div>

        {/* File uploads (URL will be stored after upload) */}
        <ImageUploaderField multiple={false} name="nid" label="NID" />
        <ImageUploaderField
          multiple={false}
          name="certificate"
          label="Certificate"
        />
        <ImageUploaderField
          multiple={false}
          name="drivingLicence"
          label="Driving Licence"
        />
        <ImageUploaderField
          multiple={false}
          name="utilityBill"
          label="Utility Bill"
        />
        <ImageUploaderField
          multiple={false}
          name="medicalReport"
          label="Medical Report"
        />
        <ImageUploaderField
          multiple={false}
          name="doopTestReport"
          label="Doop Test Report"
        />
        <ImageUploaderField multiple={false} name="visa" label="Visa" />
        <ImageUploaderField multiple={false} name="passport" label="Passport" />
        <ImageUploaderField multiple={false} name="ticket" label="Ticket" />

        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {service ? "Update Service" : "Create Service"}
        </Button>
      </form>
    </Form>
  );
}
