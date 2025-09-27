"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageUploaderField from "@/components/global/form-field/image-uploader-field";
import InputField from "@/components/global/form-field/input-field";
import MultiSelectField from "@/components/global/form-field/multi-select-field";
import SelectField from "@/components/global/form-field/select-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import TiptapEditorField from "@/components/global/form-field/tiptap-editor-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAllCategories } from "@/lib/actions/category.action";
import { getAllImages } from "@/lib/actions/image.action";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import {
  type ProductUpsertInput,
  productUpsertSchema,
} from "@/lib/validators/product";
import CategoryForm from "../category/category-form";

const STATUSES: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

export default function ProductForm({ product }: { product?: ProductForEdit }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
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

  const resolver = zodResolver(productUpsertSchema);

  const form = useForm<ProductUpsertInput>({
    resolver: resolver as Resolver<ProductUpsertInput>,
    mode: "onChange",
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? null,
      shortDescription: product?.shortDescription ?? null,
      status: (product?.status as ProductUpsertInput["status"]) ?? "ACTIVE",
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice ?? null,
      stock: product?.stock ?? 0,
      imageUrls: (defaultImageUrls ?? []) as string[],
      categoryIds: (defaultCategoryIds ?? []) as string[],
      tag: product?.tag ?? undefined,
      packageWeight: product?.packageWeight ?? undefined,
      packageDuration: product?.packageDuration ?? undefined,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllCategories();
        if (Array.isArray(result)) setCategories(result as Category[]);
      } catch {
        toast.error("Failed to fetch categories");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await getAllImages();
        if (Array.isArray(result)) setImages(result as ProductImage[]);
      } catch {
        toast.error("Failed to fetch images");
      }
    })();
  }, []);

  console.log(images);

  async function onSubmit(values: ProductUpsertInput) {
    if (product?.id) {
      toast.promise(
        updateProduct({
          productId: product.id,
          data: values,
          path: pathname ?? "",
        }),
        {
          loading: "Updating product...",
          success: () => {
            if (!product) router.refresh();
            return "Product updated!";
          },
          error: () => "Failed to update product.",
        },
      );
    } else {
      toast.promise(createProduct(values), {
        loading: "Creating product...",
        success: () => {
          form.reset();
          router.push("/admin/products", { scroll: false });
          if (!product) router.refresh();
          return "Product created successfully!";
        },
        error: () => "Failed to create product.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card p-4 rounded-md border grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Title */}
        <InputField
          name="title"
          label="Title"
          placeholder="Enter product title"
          requiredMark
          className="sm:col-span-2"
        />

        {/* Pricing */}
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

        {/* Inventory + New fields */}
        <InputField
          type="number"
          name="stock"
          label="Stock"
          placeholder="e.g. 100"
          requiredMark
        />
        <InputField
          name="tag"
          label="Tag (Optional)"
          placeholder="e.g. Hot, Best, New"
        />

        <InputField
          name="packageWeight"
          label="Package Weight (Optional)"
          placeholder="e.g. 250g"
        />
        <InputField
          name="packageDuration"
          label="Package Duration (Optional)"
          placeholder="e.g. 30 days"
        />

        {/* Images */}
        <ImageUploaderField
          name="imageUrls"
          label="Images"
          multiple
          className="sm:col-span-2"
        />

        {/* Categories */}
        <MultiSelectField
          name="categoryIds"
          label="Categories"
          placeholder="Select categories"
          options={categories.map((c) => ({ label: c.name, value: c.id }))}
          renderCreate={
            <CategoryForm
              onCategoryCreated={async () => {
                router.refresh();
                const result = await getAllCategories();
                setCategories(Array.isArray(result) ? result : []);
              }}
            />
          }
        />

        {/* Status */}
        <SelectField
          name="status"
          label="Status"
          placeholder="Select status"
          options={STATUSES.map((status) => ({ value: status, label: status }))}
        />

        {/* Description */}
        <TextareaField
          name="shortDescription"
          label=" Short Description (Optional)"
          placeholder="Enter product short description"
          className="sm:col-span-2"
        />

        <TiptapEditorField
          name="description"
          label="Description (Optional)"
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
