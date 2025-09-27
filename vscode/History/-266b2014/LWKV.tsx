import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus } from "lucide-react";
import { useState } from "react";

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
    </div>
  );
}
