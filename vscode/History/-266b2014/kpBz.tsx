"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ImageUp } from "lucide-react";
import { uploadImageToVPS } from "@/lib/upload-image";

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
