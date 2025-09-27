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

  return (
    <div className="space-y-3">
      {value.map((image, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input value={image.url} disabled className="bg-muted" />
          <Button
            type="button"
            variant="outline"
            onClick={() => (open ? open() : null)}
            className="w-fit"
          >
            <Minus strokeWidth={1} />
          </Button>
        </div>
      ))}
    </div>
  );
}
