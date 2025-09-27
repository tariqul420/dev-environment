"use client";

import { IconPlus } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/lib/actions/category.action";
import logger from "@/lib/logger";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/utils";

interface CategoryFormProps {
  onCategoryCreated?: () => void;
}

export default function CategoryForm({ onCategoryCreated }: CategoryFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit() {
    setLoading(true);
    try {
      // Handle category submission logic here
      if (!category) return;

      toast.promise(createCategory(category, pathname as string), {
        loading: "Creating category...",
        success: (res) => {
          setCategory("");
          router.push(pathname as string, { scroll: false });
          router.refresh();
          onCategoryCreated?.();
          return `Category ${res.name} created successfully!`;
        },
        error: (err) => `Error creating category: ${err}`,
      });
    } catch (error) {
      logger.error("Error updating category", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";

      if (!searchParams) return;

      if (category) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "cq",
          value: category,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["cq"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category, router, searchParams]);

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Enter category name"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      />
      <Button
        type="button"
        onClick={onSubmit}
        variant="outline"
        disabled={loading}
      >
        <IconPlus size={12} />
      </Button>
    </div>
  );
}
