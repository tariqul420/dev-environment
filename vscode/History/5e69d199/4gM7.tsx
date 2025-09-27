import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUp, MinusIcon, Plus } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

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
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {multiple ? (
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
                      <MinusIcon />
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
            ) : (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                onSuccess={(result) => {
                  if (
                    result.info &&
                    typeof result.info === "object" &&
                    "secure_url" in result.info
                  ) {
                    form.setValue("image", result.info.secure_url);
                  }
                }}
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                }}
              >
                {({ open }) => (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Upload thumbnail"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => (open ? open() : null)}
                      className="w-fit"
                    >
                      <ImageUp strokeWidth={1} />
                    </Button>
                  </div>
                )}
              </CldUploadWidget>
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
