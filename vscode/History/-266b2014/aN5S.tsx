import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  value: { url: string }[];
  onChange: (newValue: { url: string }[]) => void;
  multiple?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const newImages: { url: string }[] = [];

    setUploading(true);

    for (const file of Array.from(files)) {
      const percent = 0;
      toast.loading(`Uploading ${file.name}...`, {
        id: file.name,
      });

      try {
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`, {
          id: file.name,
        });
      }
    }
  };

  const handelRemove = (index: number) => {
    const uploaded = value.filter((_, i) => i !== index);
    onChange(uploaded);
  };

  return (
    <div className="space-y-3">
      {value.map((image, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={image.url} disabled className="bg-muted" />
          <Button
            type="button"
            variant="outline"
            onClick={() => handelRemove(index)}
            className="w-fit"
          >
            <Minus />
          </Button>
        </div>
      ))}

      {(!multiple && value.length === 0) || multiple ? (
        <Input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
        />
      ) : null}
    </div>
  );
}
