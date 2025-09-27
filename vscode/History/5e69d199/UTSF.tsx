import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  multiple?: boolean;
  className?: string;
}

export default function ImageUploaderField({
  name,
  label,
  multiple = false,
  className,
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl></FormControl>
        </FormItem>
      )}
    />
  );
}
