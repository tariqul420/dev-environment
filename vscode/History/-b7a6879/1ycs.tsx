'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUp, Trash2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
}

interface ImageUrl {
  url: string;
}

export default function ImageUploaderField({ name, label, multiple = false, className }: Props) {
  const { control, setValue, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Multiple image mode */}
              {multiple ? (
                <>
                  {((getValues(name) as ImageUrl[]) || []).map((item, index) => (
                    <div key={index} className="relative group border rounded-md overflow-hidden">
                      <Image src={item.url} alt={`Uploaded image ${index + 1}`} width={300} height={200} className="w-full h-[200px] object-cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted/70"
                        onClick={() => {
                          const updated = (getValues(name) as ImageUrl[]).filter((_, i) => i !== index);
                          setValue(name, updated);
                        }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </>
              ) : (
                // Single image mode
                <>
                  {getValues(name) && (
                    <div className="relative group border rounded-md overflow-hidden">
                      <Image src={getValues(name)} alt="Uploaded image" width={300} height={200} className="w-full h-[200px] object-cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted/70"
                        onClick={() => setValue(name, '')}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Upload UI */}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                onSuccess={(result) => {
                  if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                    const url = result.info.secure_url;
                    if (multiple) {
                      setValue(name, [...(getValues(name) || []), { url }]);
                    } else {
                      setValue(name, url);
                    }
                  }
                }}
                options={{
                  maxFiles: multiple ? 5 : 1,
                  resourceType: 'image',
                }}>
                {({ open }) => (
                  <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-4 cursor-pointer hover:bg-muted transition h-[200px]" onClick={() => open?.()}>
                    <ImageUp className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs mt-2 text-muted-foreground">Upload or drag here</p>
                    <span className="text-[10px] text-muted-foreground">JPG, PNG — max 300×200</span>
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
