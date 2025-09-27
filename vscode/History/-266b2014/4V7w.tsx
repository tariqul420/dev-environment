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