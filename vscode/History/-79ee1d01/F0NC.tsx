"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  decrementQty,
  incrementQty,
  selectProductQty,
  setProductQuantity,
} from "@/lib/redux/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export default function QuantityInput({
  id,
  min = 1,
  max = 99,
}: {
  id: string;
  min?: number;
  max?: number;
}) {
  const dispatch = useAppDispatch();
  const qty = useAppSelector((s) => selectProductQty(s, id));

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => dispatch(decrementQty({ id }))}
        className="h-10 w-10"
        disabled={qty <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="bg-light font-grotesk flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent">
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
      </div>

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
