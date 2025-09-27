import { FormField, FormItem } from "@/components/ui/form";

interface Props {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
}

export default function TextareaField({ name, label, placeholder }: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-1 sm:col-span-2">
          <FormLabel>Description</FormLabel>
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
