import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  name: string;
  label: string;
  placeholder: string;
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
            <Textarea
              placeholder="Enter blog description"
              {...field}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
