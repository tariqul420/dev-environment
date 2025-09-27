"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setProductQuantity } from "@/lib/features/global/global-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Minus, Plus } from "lucide-react";

export default function QuantityInput() {
  const productQuantity = useAppSelector(
    (state) => state.globals.productQuantity,
  );
  const dispatch = useAppDispatch();
  const handleIncrement = () => {
    dispatch(setProductQuantity(productQuantity + 1));
  };

  const handleDecrement = () => {
    dispatch(setProductQuantity(Math.max(1, productQuantity - 1)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    dispatch(setProductQuantity(Math.max(1, value)));
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        className="h-10 w-10"
        disabled={productQuantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={productQuantity}
        onChange={handleInputChange}
        className="w-20 text-center"
        min={1}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        className="h-10 w-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
