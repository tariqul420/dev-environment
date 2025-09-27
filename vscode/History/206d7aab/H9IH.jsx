import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export function CheckboxField({ name, label, disabled = false, className }) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex items-center gap-2", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel className="ml-2">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
