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
      render={({ field }) => {
        // field থেকে value এবং onChange বাদ দিয়ে বাকি প্রপার্টি পাস করা
        const { value, onChange: formOnChange, ...restField } = field;
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                disabled={disable}
                value={value || ""} // ফর্ম রিসেটের জন্য মান সেট
                onChange={(e) => {
                  const inputValue =
                    type === "number"
                      ? e.target.value
                        ? Number(e.target.value)
                        : ""
                      : e.target.value;
                  formOnChange(inputValue);
                  if (onChange) onChange(e);
                }}
                {...restField} // শুধু ref, onBlur ইত্যাদি পাস করা
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
