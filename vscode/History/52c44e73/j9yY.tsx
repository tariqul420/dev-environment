import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
}

export default function TextareaField({
  name,
  label,
  placeholder,
  className,
  minHeight,
  onChange,
  value,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="bg-light font-grotesk flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent">
              <Textarea
                placeholder={placeholder}
                className={cn("w-full", minHeight)}
                {...field}
                value={value ?? field.value}
                onChange={onChange ?? field.onChange}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
