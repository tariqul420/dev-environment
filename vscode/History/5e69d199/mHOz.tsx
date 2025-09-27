"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  GripVertical as IconGripVertical,
  ImageUp,
  Trash2,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
  viewClass?: string;
}

function SortableImageItem({
  url,
  index,
  onDelete,
}: {
  url: string;
  index: number;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? "0 10px 25px rgba(0,0,0,.15)" : undefined,
  };

  const valid = typeof url === "string" && url.trim() !== "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-md border"
    >
      {valid ? (
        <Image
          src={url}
          alt={`Uploaded image ${index + 1}`}
          width={300}
          height={200}
          className="h-[200px] w-full object-cover"
        />
      ) : (
        <div className="text-muted-foreground flex h-[200px] w-full items-center justify-center text-xs">
          Invalid image URL
        </div>
      )}

      {/* drag handle */}
      <Button
        {...attributes}
        {...listeners}
        type="button"
        variant="ghost"
        size="icon"
        className="bg-muted/70 absolute top-2 left-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Drag to reorder"
      >
        <IconGripVertical className="size-4" />
      </Button>

      {/* delete */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="bg-muted/70 absolute top-2 right-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onDelete}
        aria-label="Remove image"
      >
        <Trash2 className="text-destructive h-4 w-4" />
      </Button>
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

  const getList = (): string[] =>
    ((getValues(name) as string[]) || []).filter((u) => !!u && u.trim() !== "");

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const list = getList();
    const from = list.findIndex((u) => u === active.id);
    const to = list.findIndex((u) => u === over.id);
    if (from < 0 || to < 0) return;

    setValue(name, arrayMove(list, from, to), { shouldDirty: true });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className={cn("grid grid-cols-2 gap-4", viewClass)}>
              {multiple ? (
                <>
                  <DndContext onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={getList()}
                      strategy={verticalListSortingStrategy}
                    >
                      {getList().map((url, index) => (
                        <SortableImageItem
                          key={url || `idx-${index}`}
                          url={url}
                          index={index}
                          onDelete={() => {
                            const updated = getList().filter(
                              (_, i) => i !== index,
                            );
                            setValue(name, updated, { shouldDirty: true });
                          }}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </>
              ) : (
                <>
                  {(() => {
                    const val = (getValues(name) as string) || "";
                    const valid = val.trim() !== "";
                    return valid ? (
                      <div className="group relative overflow-hidden rounded-md border">
                        <Image
                          src={val}
                          alt="Uploaded image"
                          width={300}
                          height={200}
                          className="h-[200px] w-full object-cover"
                        />
                        {/* Only delete on single; no drag */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="bg-muted/70 absolute top-2 right-2 size-8 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() =>
                            setValue(name, "", { shouldDirty: true })
                          }
                          aria-label="Remove image"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      </div>
                    ) : null;
                  })()}
                </>
              )}

              {/* Upload UI */}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                onSuccess={(result) => {
                  if (
                    result.info &&
                    typeof result.info === "object" &&
                    "secure_url" in result.info
                  ) {
                    const url = result.info.secure_url as string;
                    if (!url) return;

                    if (multiple) {
                      const current = getList();
                      setValue(name, [...current, url], { shouldDirty: true });
                    } else {
                      setValue(name, url, { shouldDirty: true });
                    }
                  }
                }}
                options={{
                  maxFiles: multiple ? 10 : 1,
                  resourceType: "image",
                }}
              >
                {({ open }) => (
                  <div
                    className="hover:bg-muted flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 transition"
                    onClick={() => open?.()}
                  >
                    <ImageUp className="text-muted-foreground h-6 w-6" />
                    <p className="text-muted-foreground mt-2 text-xs">
                      {multiple
                        ? "Upload or drag here"
                        : getValues(name)
                          ? "Replace with another image"
                          : "Upload or drag here"}
                    </p>
                    <span className="text-muted-foreground text-[10px]">
                      JPG, PNG — max 300×200
                    </span>
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
