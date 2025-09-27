"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploaderField from "@/components/global/form-field/image-uploader-field";
import { InputField } from "@/components/global/form-field/input-field";
import TextareaField from "@/components/global/form-field/textarea-field";
import TiptapEditorField from "@/components/global/form-field/tiptap-editor-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { getCategories } from "@/lib/actions/category.action";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { Category, IProduct } from "@/types/product";
import CategoryForm from "./category-form";

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
    .array(
      z.object({
        url: z.string().url({ message: "Image must be a valid URL." }),
      }),
    )
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
  const path = usePathname();
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
      imageUrls: product?.imageUrls.map((url) => ({ url })) || [],
      regularPrice: product?.regularPrice || 0,
      salePrice: product?.salePrice || 0,
      detailedDesc: product?.detailedDesc || "",
      tag: product?.tag || "",
      packageDuration: product?.packageDuration || "",
      weight: product?.weight || "",
    },
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: "imageUrls",
  });

  // Submit handler
  function onSubmit(values: FormValues) {
    const transformedValues = {
      ...values,
      imageUrls: values.imageUrls.map((image) => image.url),
    };

    if (product) {
      toast.promise(
        updateProduct({
          productId: product._id,
          data: transformedValues,
          path: path,
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
            console.error("Error updating product:", error);
            return "Failed to update product.";
          },
        },
      );
    } else {
      toast.promise(createProduct({ data: transformedValues, path: path }), {
        loading: "Creating product...",
        success: () => {
          router.refresh();
          form.reset();
          router.push("/admin/products", { scroll: false });
          return "Product created successfully!";
        },
        error: (error) => {
          console.error("Error creating product:", error);
          return "Failed to create product.";
        },
      });
    }
  }

  // Fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getCategories();
        if (!result || !Array.isArray(result)) {
          console.error("Invalid categories result:", result);
          return;
        }
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategory();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 sm:gap-8"
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
        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-full overflow-hidden">
                    {field.value.length === 0
                      ? "Select categories"
                      : categories
                          .filter((cat) => field.value.includes(cat._id))
                          .map((cat) => cat.name)
                          .join(", ")}
                  </SelectTrigger>
                  <SelectContent>
                    {/* Category creation form */}
                    <CategoryForm
                      onCategoryCreated={async () => {
                        router.refresh();
                        setTimeout(async () => {
                          const result = await getCategories();
                          if (!result || !Array.isArray(result)) {
                            console.error("Invalid categories result:", result);
                            return;
                          }
                          setCategories(result);
                        }, 100);
                      }}
                    />
                    <div className="mt-2 flex flex-col gap-1">
                      {categories.map((cate) => (
                        <label
                          key={cate._id}
                          className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1"
                        >
                          <Checkbox
                            checked={field.value.includes(cate._id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, cate._id]);
                              } else {
                                field.onChange(
                                  field.value.filter((id) => id !== cate._id),
                                );
                              }
                            }}
                          />
                          {cate.name}
                        </label>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
        {/* <FormField
          control={form.control}
          name="imageUrls"
          render={() => (
            <FormItem className="col-span-1 sm:col-span-2">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          {...form.register(`imageUrls.${index}.url` as const)}
                          disabled
                          placeholder="Image URL"
                          className="bg-muted"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                        className="w-fit"
                      >
                        <Minus />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Upload images"
                      disabled
                      className="bg-muted"
                    />
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                      onSuccess={(result) => {
                        const { info } = result;
                        if (
                          info &&
                          typeof info === "object" &&
                          "secure_url" in info
                        ) {
                          append({ url: info.secure_url as string });
                        }
                      }}
                      options={{
                        maxFiles: 5,
                        resourceType: "image",
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => (open ? open() : null)}
                          className="w-fit"
                        >
                          <Plus strokeWidth={1} />
                          Add Image
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <ImageUploaderField
          name="imageUrls"
          label="Images"
          multiple={true}
          className="col-span-1 sm:col-span-2"
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
          disabled={form.formState.isSubmitting}
        >
          {product ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
