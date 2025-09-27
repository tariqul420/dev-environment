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
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "datetime-local"
    | "time";
  disable?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  name,
  label,
  placeholder,
  type = "text",
  disable = false,
  className,
  onChange,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disable}
              onChange={(e) => {
                // Handle form state update
                const value =
                  type === "number" ? Number(e.target.value) : e.target.value;
                field.onChange(value);
                // Call custom onChange if provided
                if (onChange) onChange(e);
              }}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
