"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageUploaderField from "@/components/global/form-field/image-uploader-field";
import InputField from "@/components/global/form-field/input-field";
import MultiSelectField from "@/components/global/form-field/multi-select-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getCategories } from "@/lib/actions/category.action";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import {
  type ProductUpsertInput,
  productUpsertSchema,
} from "@/lib/validators/product";

type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type Category = { id: string; name: string };
type ProductImage = {
  id: string;
  url: string;
  sort: number;
  alt?: string | null;
};
type ProductForEdit = {
  id: string;
  title: string;
  description?: string | null;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images?: ProductImage[];
  categories?: { category: { id: string; name: string } }[];
};

const STATUSES: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

function MoneyFields() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InputField
        type="number"
        step="0.01"
        name="price"
        label="Price (Sale)"
        placeholder="e.g. 499.00"
      />
      <InputField
        type="number"
        step="0.01"
        name="compareAtPrice"
        label="Compare At Price (Optional)"
        placeholder="e.g. 599.00"
      />
    </div>
  );
}

function InventoryFields() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <InputField
        type="number"
        name="stock"
        label="Stock"
        placeholder="e.g. 100"
      />
    </div>
  );
}

function StatusSelect() {
  return (
    <div className="grid grid-cols-1">
      <InputField
        name="status"
        label="Status"
        placeholder="Select status"
        list="product-statuses"
      />
      <datalist id="product-statuses">
        {STATUSES.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      {/* <SelectField
        name="status"
        label="Status"
        placeholder="Select status"
        options={STATUSES.map((s) => ({ value: s, label: s }))}
      /> */}
    </div>
  );
}

export default function ProductForm({ product }: { product?: ProductForEdit }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const defaultImageUrls = useMemo(
    () =>
      product?.images?.length
        ? [...product.images].sort((a, b) => a.sort - b.sort).map((i) => i.url)
        : [],
    [product?.images],
  );

  const defaultCategoryIds = useMemo(
    () =>
      product?.categories?.length
        ? product.categories.map((c) => c.category.id).filter(Boolean)
        : [],
    [product?.categories],
  );

  const form = useForm<ProductUpsertInput>({
    resolver: zodResolver(productUpsertSchema) as any,
    defaultValues: {
      title: product?.title || "",
      description: product?.description ?? "",
      status: (product?.status as ProductStatus) || "ACTIVE",
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice ?? null,
      stock: product?.stock ?? 0,
      imageUrls: defaultImageUrls,
      categoryIds: defaultCategoryIds,
      path: pathname ?? "",
    },
  });

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        const result = await getCategories();
        if (Array.isArray(result)) setCategories(result as Category[]);
      } catch (_) {
        toast.error("Failed to fetch categories");
      }
    })();
  }, []);

  async function onSubmit(values: ProductUpsertInput) {
    toast.promise(
      product
        ? updateProduct({
            productId: product.id,
            data: values,
            path: pathname ?? "",
          })
        : createProduct(values),
      {
        loading: product ? "Updating product..." : "Creating product...",
        success: (created) => {
          form.reset();
          router.push(`/admin/products/${product ? values.slug : created.id}`, {
            scroll: false,
          });
          router.refresh();
          return product ? "Product updated!" : "Product created successfully!";
        },
        error: () =>
          product ? "Failed to update product." : "Failed to create product.",
      },
    );
    // if (product?.id) {
    //   toast.promise(
    //     updateProduct({
    //       productId: product.id,
    //       data: values,
    //       path: pathname ?? "",
    //     }),
    //     {
    //       loading: "Updating product...",
    //       success: () => {
    //         router.push(`/admin/products/${values.slug}`, { scroll: false });
    //         router.refresh();
    //         return "Product updated!";
    //       },
    //       error: () => "Failed to update product.",
    //     },
    //   );
    // } else {
    //   toast.promise(createProduct(values), {
    //     loading: "Creating product...",
    //     success: (created) => {
    //       form.reset();
    //       router.push(`/admin/products/${created.slug}`, { scroll: false });
    //       router.refresh();
    //       return "Product created successfully!";
    //     },
    //     error: () => "Failed to create product.",
    //   });
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card p-4 rounded-md border grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Title & Slug */}
        <InputField
          name="title"
          label="Title"
          placeholder="Enter product title"
        />

        {/* Description */}
        <TextareaField
          name="description"
          label="Description (Optional)"
          placeholder="Enter product description"
          className="sm:col-span-2"
        />

        {/* Status */}
        <StatusSelect />

        {/* Pricing */}
        <MoneyFields />

        {/* Inventory */}
        <InventoryFields />

        {/* Images */}
        <ImageUploaderField
          name="imageUrls"
          label="Images"
          multiple
          className="sm:col-span-2"
          viewClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        />

        {/* Categories */}
        <MultiSelectField
          name="categoryIds"
          label="Categories"
          placeholder="Select categories"
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          className="sm:col-span-2"
        />

        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {product ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
