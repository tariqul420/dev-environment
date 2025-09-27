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
        const { value, onChange: formOnChange, ...restField } = field;
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="bg-light font-grotesk flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent">
                <Input
                  placeholder={placeholder}
                  type={type}
                  disabled={disable}
                  value={value || ""}
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
                  {...restField}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
