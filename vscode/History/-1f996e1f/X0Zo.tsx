import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disable?: boolean;
}

export function InputField({
  name,
  label,
  placeholder,
  type = "text",
  disable = false,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter blog title" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
