"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploaderField from "@/components/global/form-field/image-uploader-field";
import { InputField } from "@/components/global/form-field/input-field";
import MultiSelectField from "@/components/global/form-field/multi-select-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import TiptapEditorField from "@/components/global/form-field/tiptap-editor-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getCategories } from "@/lib/actions/category.action";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import logger from "@/lib/logger";
import { Category, IProduct } from "@/types/product";
import CategoryForm from "../category/category-form";

// Updated Zod schema
const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),
  titleBengali: z
    .string()
    .min(2, { message: "Bengali title must be at least 2 characters." })
    .max(100, { message: "Bengali title must be at most 100 characters." }),
  shortDesc: z
    .string()
    .min(10, { message: "Short description must be at least 10 characters." }),
  categoryIds: z
    .array(z.string().min(1, { message: "Category ID is required." }))
    .min(1, { message: "Select at least one category." }),
  imageUrls: z
    .array(z.string().url({ message: "Image must be a valid URL." }))
    .min(1, { message: "At least one image is required." }),
  regularPrice: z
    .number()
    .min(1, { message: "Regular price must be at least 1." }),
  salePrice: z.number().min(1, { message: "Sale price must be at least 1." }),
  detailedDesc: z.string().min(10, {
    message: "Detailed description must be at least 10 characters.",
  }),
  tag: z.string().optional(),
  packageDuration: z.string().optional(),
  weight: z.string().min(1, { message: "Weight is required." }),
});

interface ProductFormProps {
  product?: IProduct & { _id: string };
}

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({ product }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: product?.title || "",
      titleBengali: product?.titleBengali || "",
      shortDesc: product?.shortDesc || "",
      categoryIds: Array.isArray(product?.categoryIds)
        ? product.categoryIds.map((id) =>
            typeof id === "object" && "_id" in id
              ? id._id.toString()
              : id.toString(),
          )
        : [],
      imageUrls: product?.imageUrls || [],
      regularPrice: product?.regularPrice || 0,
      salePrice: product?.salePrice || 0,
      detailedDesc: product?.detailedDesc || "",
      tag: product?.tag || "",
      packageDuration: product?.packageDuration || "",
      weight: product?.weight || "",
    },
  });

  // Submit handler
  function onSubmit(values: FormValues) {
    const transformedValues = {
      ...values,
    };

    if (product) {
      toast.promise(
        updateProduct({
          productId: product._id,
          data: transformedValues,
          path: pathname as string,
        }),
        {
          loading: "Updating product...",
          success: (updatedProduct) => {
            const newPath = `/admin/products/${updatedProduct.slug}`;
            router.push(newPath, { scroll: false });
            router.refresh();
            return "Product updated!";
          },
          error: (error) => {
            logger.error("Error updating product:", error);
            return "Failed to update product.";
          },
        },
      );
    } else {
      toast.promise(
        createProduct({ data: transformedValues, path: pathname as string }),
        {
          loading: "Creating product...",
          success: () => {
            router.refresh();
            form.reset();
            router.push("/admin/products", { scroll: false });
            return "Product created successfully!";
          },
          error: (error) => {
            logger.error("Error creating product:", error);
            return "Failed to create product.";
          },
        },
      );
    }
  }

  // Fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getCategories();
        if (!result || !Array.isArray(result)) {
          logger.error("Invalid categories result:", result);
          return;
        }
        setCategories(result);
      } catch (error) {
        logger.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategory();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Title */}
        <InputField
          name="title"
          label="Product Title"
          placeholder="Enter product title"
        />

        {/* Bengali Title */}
        <InputField
          name="titleBengali"
          label="Bengali Title"
          placeholder="Enter bengali product title"
        />

        {/* Category */}

        <MultiSelectField
          name="categoryIds"
          label="Categories"
          placeholder="Select categories"
          options={categories.map((c) => ({ label: c.name, value: c._id }))}
          renderCreate={
            <CategoryForm
              onCategoryCreated={async () => {
                router.refresh();
                const result = await getCategories();
                setCategories(Array.isArray(result) ? result : []);
              }}
            />
          }
          // Optional: custom summary text
          // summaryFormatter={(selected, all) => {
          //   if (!selected.length)
          //     return (
          //       <span className="text-muted-foreground">Select categories</span>
          //     );
          //   const names = selected
          //     .map((id) => all.find((o) => o.value === id)?.label)
          //     .filter(Boolean) as string[];
          //   return (
          //     <span className="truncate">
          //       {names.length > 3
          //         ? `${names.length} selected`
          //         : names.join(", ")}
          //     </span>
          //   );
          // }}
        />

        {/* Regular Price */}
        <InputField
          type="number"
          name="regularPrice"
          label="Regular Price"
          placeholder="Enter regular price"
        />

        {/* Sale Price */}
        <InputField
          type="number"
          name="salePrice"
          label="Sale Price"
          placeholder="Enter sale price"
        />

        {/* Weight */}
        <InputField
          name="weight"
          label="Weight"
          placeholder="Enter product weight"
        />

        {/* Tag */}
        <InputField
          name="tag"
          label="Tag (Optional)"
          placeholder="Enter product tag"
        />

        {/* Package Duration */}
        <InputField
          name="packageDuration"
          label="Package Duration (Optional)"
          placeholder="Enter package duration"
        />

        {/* Images */}
        <ImageUploaderField
          name="imageUrls"
          label="Images"
          multiple
          className="col-span-2"
          viewClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        />

        {/* Short Description */}
        <TextareaField
          name="shortDesc"
          label="Short Description"
          placeholder="Enter product short description"
          className="col-span-1 sm:col-span-2"
        />

        {/* Detailed Description */}
        <TiptapEditorField
          name="detailedDesc"
          label="Detailed Description"
          className="col-span-1 sm:col-span-2"
        />

        {/* Submit Button */}
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
