import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUp, Minus, Plus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
}

export default function ImageUploaderField({
  name,
  label,
  multiple = false,
  className,
}: Props) {
  const { control, setValue, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {multiple ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {(getValues(name) || []).map(
                  (item: { url: string }, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item.url}
                        disabled
                        placeholder="Image URL"
                        className="bg-muted"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const updatedUrls = getValues(name).filter(
                            (_: any, i: number) => i !== index,
                          );
                          setValue(name, updatedUrls);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ),
                )}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Upload images"
                    disabled
                    className="bg-muted"
                  />
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                    onSuccess={(result) => {
                      if (
                        result.info &&
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        setValue(name, [
                          ...(getValues(name) || []),
                          { url: result.info.secure_url },
                        ]);
                      }
                    }}
                    options={{ maxFiles: 5, resourceType: "image" }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => open?.()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Upload image"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled
                  className="bg-muted"
                />
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                  onSuccess={(result) => {
                    if (
                      result.info &&
                      typeof result.info === "object" &&
                      "secure_url" in result.info
                    ) {
                      setValue(name, result.info.secure_url);
                    }
                  }}
                  options={{ maxFiles: 1, resourceType: "image" }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => open?.()}
                    >
                      <ImageUp className="h-4 w-4" />
                    </Button>
                  )}
                </CldUploadWidget>
              </div>
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
