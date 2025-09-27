"use client";

import { formUrlQuery } from "@/lib/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Sort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortOption, setSortOption] = useState("default");
  const pathName = usePathname();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (sortOption) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "sort",
          value: sortOption,
        });
      }
      router.push(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, sortOption]);

  return (
    <Select value={sortOption} onValueChange={setSortOption}>
      <SelectTrigger className="font-grotesk w-full md:w-48">
        <SelectValue placeholder="Default sorting" />
      </SelectTrigger>
      <SelectContent className="font-grotesk">
        <SelectItem value="default">Default sorting</SelectItem>
        <SelectItem value="date">Sort by oldest</SelectItem>
        {pathName === "/products" && (
          <>
            <SelectItem value="price-low">
              Sort by price: low to high
            </SelectItem>
            <SelectItem value="price-high">
              Sort by price: high to low
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
