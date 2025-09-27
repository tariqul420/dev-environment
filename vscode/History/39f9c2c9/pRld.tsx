import TiptapEditor from "@/components/tiptap-editor/tiptap-editor";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  className?: string;
}

export default function TiptapEditorField({ name, label, className }: Props) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <TiptapEditor
                content={field.value}
                onChange={field.onChange}
                className={
                  "bg-primary-foreground min-h-[160px] rounded-md border px-3 py-2"
                }
              />
            )}
          />
        </FormItem>
      )}
    />
  );
}
