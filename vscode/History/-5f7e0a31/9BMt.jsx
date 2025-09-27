import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function AddToCard({ courseId, course, user }) {
  const [inCart, setInCart] = useState(false);

  const alreadyPurchased = Boolean(course?.students?.includes(user?.userId ?? ""));
  const notStudent = user?.role !== "student";

  // Read cart from localStorage safely (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("edu_course") || "{}";
      const stored = JSON.parse(raw);
      setInCart(Boolean(stored[courseId]));
    } catch {
      // if parsing fails, reset storage
      window.localStorage.setItem("edu_course", "{}");
      setInCart(false);
    }
  }, [courseId]);

  const handleToggle = () => {
    if (alreadyPurchased) {
      toast.error("You already purchased this course.");
      return;
    }
    if (notStudent) {
      toast.error("Only students can add courses to the cart.");
      return;
    }

    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("edu_course") || "{}";
    let stored: Record<string, true>;
    try {
      stored = JSON.parse(raw);
    } catch {
      stored = {};
    }

    if (stored[courseId]) {
      delete stored[courseId];
      setInCart(false);
      toast.success("Removed from cart.");
      onChange?.(false);
    } else {
      stored[courseId] = true;
      setInCart(true);
      toast.success("Added to cart.");
      onChange?.(true);
    }

    window.localStorage.setItem("edu_course", JSON.stringify(stored));
  };

  const label = notStudent
    ? "Only students can add"
    : alreadyPurchased
    ? "Already purchased"
    : inCart
    ? "Remove from cart"
    : "Add to cart";

  return (
    <Button
      onClick={handleToggle}
      variant={notStudent || alreadyPurchased ? "secondary" : "default"}
      disabled={notStudent || alreadyPurchased}
      aria-pressed={inCart}
      className={cn(
        "mt-5 px-4 py-1.5 transition-colors",
        notStudent || alreadyPurchased
          ? "cursor-not-allowed"
          : "cursor-pointer"
      )}
    >
      {label}
    </Button>
  );
}
