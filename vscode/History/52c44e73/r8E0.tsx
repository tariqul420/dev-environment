import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export default function TextareaField({
  name,
  label,
  placeholder,
  className,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} className="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
