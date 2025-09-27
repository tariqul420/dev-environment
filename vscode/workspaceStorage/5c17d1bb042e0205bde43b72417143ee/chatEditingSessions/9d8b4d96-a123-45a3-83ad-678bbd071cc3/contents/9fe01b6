"use client";

import {
  AlertCircleIcon,
  GripVerticalIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFileUpload, type FileWithPreview } from "@/lib/hooks/use-file-upload";
import { cn } from "@/lib/utils";

import { DndContext, type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
  viewClass?: string;
};

type InitialFileMeta = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

/** Unsigned Cloudinary upload via REST */
async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!cloudName || !preset) {
    throw new Error(
      "Missing Cloudinary config. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_PRESET.",
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", preset);

  const res = await fetch(endpoint, { method: "POST", body });
  if (!res.ok)
    throw new Error((await res.text()) || "Cloudinary upload failed");
  const json = await res.json();
  return json.secure_url as string;
}

// Sortable image item component
function SortableImageItem({ 
  file, 
  onDelete, 
  isBusy 
}: { 
  file: FileWithPreview; 
  onDelete: () => void; 
  isBusy: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: file.id,
    disabled: isBusy 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,.15)' : undefined,
  };

  const src = file.preview || "";

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "bg-accent relative aspect-square rounded-md transition-all duration-200 group",
        isDragging && "opacity-75"
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={typeof file.file === 'object' && 'name' in file.file ? file.file.name : "image"}
          fill
          className="rounded-[inherit] object-cover"
        />
      ) : (
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
          Preview not available
        </div>
      )}

      {/* Drag handle - only show when not busy */}
      {!isBusy && (
        <Button
          {...attributes}
          {...listeners}
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1 left-1 z-20 size-8 bg-black/20 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/30"
          aria-label="Drag to reorder"
          onClick={() => console.log('🎯 Drag handle clicked for file:', file.id)}
        >
          <GripVerticalIcon className="size-3 text-white" />
        </Button>
      )}

      {/* Remove button */}
      <Button
        onClick={onDelete}
        size="icon"
        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none z-30"
        aria-label="Remove image"
        disabled={isBusy}
      >
        <XIcon className="size-3.5" />
      </Button>

      {/* Loading state */}
      {isBusy && (
        <div className="absolute inset-0 grid place-items-center rounded-[inherit] bg-black/30 text-[11px] text-white z-20">
          Uploading…
        </div>
      )}
    </div>
  );
}

export default function ImageUploaderField({
  name,
  label,
  multiple = false,
  className,
  viewClass,
}: Props) {
  const { control, setValue, getValues } = useFormContext();

  // --- RHF helpers ---
  const getList = useCallback((): string[] => {
    const v = getValues(name);
    if (Array.isArray(v)) return (v as string[]).filter(Boolean);
    if (typeof v === "string" && v.trim()) return [v.trim()];
    return [];
  }, [getValues, name]);

  const setList = useCallback(
    (urls: string[]) => {
      if (multiple) {
        setValue(name, urls, { shouldDirty: true, shouldValidate: true });
      } else {
        setValue(name, urls[0] ?? "", {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    },
    [multiple, name, setValue],
  );

  // Build initial files from RHF (string | string[])
  const initialFiles: InitialFileMeta[] = useMemo(() => {
    const urls = getList();
    return urls.map((url, i) => ({
      name: `image-${i + 1}.jpg`,
      size: 0,
      type: "image/jpeg",
      url,
      id: `init-${i}-${url}`,
    }));
  }, [getList]);

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = multiple ? 10 : 1;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearErrors,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple,
    maxFiles,
    initialFiles,
  });

  const idToUrl = useRef<Record<string, string>>(
    Object.fromEntries(initialFiles.map((f) => [f.id, f.url])),
  );

  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fileOrder, setFileOrder] = useState<string[]>([]);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    })
  );

  // Sync file order with files array
  useEffect(() => {
    const currentFileIds = files.map(f => f.id as string);
    setFileOrder(prevOrder => {
      // If no previous order or length mismatch, use current order
      if (prevOrder.length === 0 || prevOrder.length !== currentFileIds.length) {
        return currentFileIds;
      }
      
      // Keep existing order but add new files at the end
      const existingIds = prevOrder.filter(id => currentFileIds.includes(id));
      const newIds = currentFileIds.filter(id => !prevOrder.includes(id));
      return [...existingIds, ...newIds];
    });
  }, [files]);

  // Get ordered files based on fileOrder
  const orderedFiles = useMemo(() => {
    if (fileOrder.length === 0) return files;
    
    const fileMap = new Map(files.map(file => [file.id as string, file]));
    return fileOrder.map(id => fileMap.get(id)).filter(Boolean) as FileWithPreview[];
  }, [files, fileOrder]);



  useEffect(() => {
    const current = getList();
    if (current.length === 0 && initialFiles.length > 0) {
      setList(initialFiles.map((f) => f.url));
    }
  }, [getList, initialFiles.length, initialFiles.map, setList]);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      setTopError(null);
      clearErrors?.();

      for (const f of files) {
        const id = f.id as string;

        if (idToUrl.current[id]) continue;

        if (f.file && f.file instanceof File) {
          try {
            setBusyIds((p) => ({ ...p, [id]: true }));
            const secureUrl = await uploadToCloudinary(f.file);
            if (cancelled) return;

            idToUrl.current[id] = secureUrl;

            if (multiple) {
              setList([...getList(), secureUrl]);
            } else {
              setList([secureUrl]);
            }
          } catch (e: unknown) {
            if (!cancelled) {
              const errorMessage =
                typeof e === "object" && e !== null && "message" in e
                  ? (e as { message?: string }).message
                  : undefined;
              setTopError(errorMessage ?? "Failed to upload image.");
              removeFile(id);
              delete idToUrl.current[id];
            }
          } finally {
            if (!cancelled) {
              setBusyIds((p) => {
                const { [id]: _omit, ...rest } = p;
                return rest;
              });
            }
          }
        }
      }
    };

    sync();
    return () => {
      cancelled = true;
    };
  }, [files, multiple, clearErrors, getList, removeFile, setList]);

  const handleRemove = useCallback(
    (id: string) => {
      const url = idToUrl.current[id];
      if (url) {
        setList(getList().filter((u) => u !== url));
        delete idToUrl.current[id];
      }
      removeFile(id);
    },
    [getList, removeFile, setList],
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log('🚀 Drag started for:', event.active.id);
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end event for reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null); // Clear active state first
    
    if (!over || active.id === over.id) {
      console.log('❌ Drag cancelled or same position');
      return;
    }

    // Find the indices in the files array
    const activeIndex = files.findIndex(f => f.id === active.id);
    const overIndex = files.findIndex(f => f.id === over.id);
    
    if (activeIndex === -1 || overIndex === -1) {
      console.log('❌ Could not find file indices');
      return;
    }

    console.log('🔄 Drag end: moving item from position', activeIndex, 'to position', overIndex);

    // Get current URLs from form state and create mapping
    const currentUrls = getList();
    
    if (currentUrls.length !== files.length) {
      console.warn('❌ URL count mismatch with file count', {
        urls: currentUrls.length,
        files: files.length
      });
      return;
    }

    // Create mapping of file ID to URL
    const idToUrlMap: Record<string, string> = {};
    files.forEach((file, index) => {
      const fileId = file.id as string;
      const url = currentUrls[index];
      if (url) {
        idToUrlMap[fileId] = url;
        idToUrl.current[fileId] = url; // Update ref too
      }
    });

    // Update file order state first
    const newFileOrder = arrayMove([...fileOrder], activeIndex, overIndex);
    setFileOrder(newFileOrder);
    
    // Create reordered URLs based on new order
    const reorderedUrls = newFileOrder.map(fileId => idToUrlMap[fileId]).filter(Boolean);
    
    console.log('📝 Original URLs:', currentUrls);
    console.log('📝 New file order:', newFileOrder);
    console.log('📝 Reordered URLs:', reorderedUrls);
    
    // Update form state
    setList(reorderedUrls);
    
    console.log('✅ Drag completed successfully');
  }, [files, getList, setList, fileOrder]);

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={cn("flex flex-col gap-2", viewClass)}>
              {/* biome-ignore lint: drag drop area is interactive */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || undefined}
                className={cn(
                  "border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]",
                )}
              >
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload image file"
                />

                {files.length > 0 ? (
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-medium">
                        Uploaded Files ({files.length})
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openFileDialog}
                        disabled={files.length >= maxFiles}
                      >
                        <UploadIcon
                          className="-ms-0.5 size-3.5 opacity-60"
                          aria-hidden="true"
                        />
                        {multiple ? "Add more" : "Replace"}
                      </Button>
                    </div>

                    {multiple ? (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <SortableContext items={files.map(f => f.id as string)} strategy={rectSortingStrategy}>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {files.map((file) => {
                              const id = file.id as string;
                              const isBusy = !!busyIds[id];

                              return (
                                <SortableImageItem
                                  key={id}
                                  file={file}
                                  onDelete={() => handleRemove(id)}
                                  isBusy={isBusy}
                                />
                              );
                            })}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {files.map((file) => {
                          const id = file.id as string;
                          const isBusy = !!busyIds[id];
                          const src = file.preview || "";

                          return (
                            <div
                              key={id}
                              className="bg-accent relative aspect-square rounded-md"
                            >
                              {src ? (
                                <Image
                                  src={src}
                                  alt={file.file?.name ?? "image"}
                                  fill
                                  className="rounded-[inherit] object-cover"
                                />
                              ) : (
                                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                                  Preview not available
                                </div>
                              )}

                              <Button
                                onClick={() => handleRemove(id)}
                                size="icon"
                                className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none z-30"
                                aria-label="Remove image"
                                disabled={isBusy}
                              >
                                <XIcon className="size-3.5" />
                              </Button>

                              {isBusy && (
                                <div className="absolute inset-0 grid place-items-center rounded-[inherit] bg-black/30 text-[11px] text-white z-20">
                                  Uploading…
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                    <div
                      className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <ImageIcon className="size-4 opacity-60" />
                    </div>
                    <p className="mb-1.5 text-sm font-medium">
                      Drop your images here
                    </p>
                    <p className="text-muted-foreground text-xs">
                      SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={openFileDialog}
                    >
                      <UploadIcon
                        className="-ms-1 opacity-60"
                        aria-hidden="true"
                      />
                      {multiple ? "Select images" : "Select image"}
                    </Button>
                  </div>
                )}
              </div>

              {(errors.length > 0 || topError) && (
                <div
                  className="text-destructive flex items-center gap-1 text-xs"
                  role="alert"
                >
                  <AlertCircleIcon className="size-3 shrink-0" />
                  <span>{topError ?? errors[0]}</span>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
