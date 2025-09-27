import { FormField } from "@/components/ui/form";

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
  return <FormField />;
}
