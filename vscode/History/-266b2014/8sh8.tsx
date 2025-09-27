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

  return <div>image-uploader</div>;
}
