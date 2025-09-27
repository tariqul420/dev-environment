"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils/utils";
import { ImageUp, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
  viewClass?: string;
}

export default function ImageUploaderField({
  name,
  label,
  multiple = false,
  className,
  viewClass,
}: Props) {
  const { control, setValue, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={cn("grid grid-cols-2 gap-4", viewClass)}>
              {/* Multiple image mode */}
              {multiple ? (
                <>
                  {((getValues(name) as string[]) || []).map((url, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-md border"
                    >
                      {url && url.trim() !== "" && (
                        <Image
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          width={300}
                          height={200}
                        />
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="bg-muted/70 absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => {
                          const updated = (getValues(name) as string[]).filter(
                            (_, i) => i !== index,
                          );
                          setValue(name, updated);
                        }}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </>
              ) : (
                // Single image mode
                <>
                  {getValues(name) && (
                    <div className="group relative overflow-hidden rounded-md border">
                      <Image
                        src={getValues(name)}
                        alt="Uploaded image"
                        width={300}
                        height={200}
                        className="h-[200px] w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="bg-muted/70 absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setValue(name, "")}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Upload UI */}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                onSuccess={(result) => {
                  if (
                    result.info &&
                    typeof result.info === "object" &&
                    "secure_url" in result.info
                  ) {
                    const url = result.info.secure_url;
                    if (multiple) {
                      const current = getValues(name) || [];
                      setValue(name, [...current, url]);
                    } else {
                      setValue(name, url);
                    }
                  }
                }}
                options={{
                  maxFiles: multiple ? 5 : 1,
                  resourceType: "image",
                }}
              >
                {({ open }) => (
                  <div
                    className="hover:bg-muted flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 transition"
                    onClick={() => open?.()}
                  >
                    <ImageUp className="text-muted-foreground h-6 w-6" />
                    <p className="text-muted-foreground mt-2 text-xs">
                      {multiple
                        ? "Upload or drag here"
                        : getValues(name)
                          ? "Replace with another image"
                          : "Upload or drag here"}
                    </p>
                    <span className="text-muted-foreground text-[10px]">
                      JPG, PNG — max 300×200
                    </span>
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
