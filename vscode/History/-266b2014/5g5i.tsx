"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageToVPS } from "@/lib/upload-image";
import { Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string | { url: string }[];
  onChange: (newValue: string | { url: string }[]) => void;
  multiple?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    const uploaded: { url: string }[] = [];

    for (const file of Array.from(files)) {
      toast.loading(`Uploading ${file.name}`, { id: file.name });

      try {
        const url = await uploadImageToVPS(file, (percent) => {
          toast.loading(`Uploading ${file.name}: ${percent}%`, {
            id: file.name,
          });
        });

        uploaded.push({ url });
        toast.success(`${file.name} uploaded`, { id: file.name });
      } catch (err) {
        toast.error(`Failed: ${file.name}`, { id: file.name });
      }
    }

    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      onChange([...current, ...uploaded]);
    } else {
      onChange(uploaded[0]?.url || "");
    }

    setUploading(false);
  };

  const handleRemove = (index: number) => {
    if (!Array.isArray(value)) return;
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {multiple && Array.isArray(value) ? (
        <>
          {value.map((img, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={img.url} disabled className="bg-muted" />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRemove(index)}
              >
                <Minus />
              </Button>
            </div>
          ))}
        </>
      ) : !multiple && typeof value === "string" ? (
        <div className="flex items-center gap-2">
          <Input value={value} disabled className="bg-muted" />
        </div>
      ) : null}

      <Input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => {
          handleUpload(e.target.files);
          e.target.value = "";
        }}
        disabled={uploading}
      />
    </div>
  );
}
