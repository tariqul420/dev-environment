import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ImageUploader from "./image-uploader";

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
}: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ImageUploader
              value={field.value}
              onChange={field.onChange}
              multiple={multiple}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
