"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  decrementQty,
  incrementQty,
  selectProductQty,
  setProductQuantity,
} from "@/lib/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Minus, Plus } from "lucide-react";

export default function QuantityInput({
  slug,
  min = 1,
  max = 99,
}: {
  slug: string;
  min?: number;
  max?: number;
}) {
  const dispatch = useAppDispatch();
  const qty = useAppSelector((s) => selectProductQty(s, slug));

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => dispatch(decrementQty({ slug }))}
        className="h-10 w-10"
        disabled={qty <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        min={min}
        max={max}
        value={qty}
        onChange={(e) => {
          const val = Math.min(
            max,
            Math.max(min, parseInt(e.target.value) || min),
          );
          dispatch(setProductQuantity({ slug, qty: val }));
        }}
        className="w-20 text-center"
      />

      <Button
        variant="outline"
        size="icon"
        onClick={() => dispatch(incrementQty({ slug, max }))}
        className="h-10 w-10"
        disabled={qty >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
