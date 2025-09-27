"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useState } from "react";

import CheckOutForm from "./check-out-form";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
export default function PaymentModal({ course, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const alreadyPayment = course?.students?.includes(user?.userId);

  const notStudent = !(user?.role === "student");

  return (
    <Elements stripe={stripePromise}>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          {alreadyPayment ? (
            <Link
              href={"/student/courses"}
              className="bg-main hover:bg-main mt-5 inline-block cursor-pointer rounded px-4 py-1.5 text-white transition-colors"
              variant="outline"
            >
              Start Course
            </Link>
          ) : (
            <button
              className={`${
                notStudent
                  ? "dark:bg-dark-hover mt-5 inline-block cursor-not-allowed rounded bg-gray-400 px-4 py-1.5 text-white transition-colors"
                  : "bg-main hover:bg-main mt-5 inline-block cursor-pointer rounded px-4 py-1.5 text-white transition-colors"
              }`}
              variant={notStudent ? "secondary" : "outline"}
              disabled={notStudent}
              onClick={() => setIsOpen(true)}
            >
              Enrollment
            </button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="px-2.5 md:px-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Authorization</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re about to purchase <strong>{course.title}</strong> for
              <strong>{course.price}</strong>. Please review your payment
              details before confirming.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CheckOutForm
            course={course}
            userId={user?.userId}
            onPaymentSuccess={() => setIsOpen(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </Elements>
  );
}
