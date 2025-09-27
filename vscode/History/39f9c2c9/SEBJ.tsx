import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
  className: string;
}

export default function TiptapEditorField({ name, label, className }: Props) {
  const { control } = useFormContext();
  return <div>tiptap-editor-field</div>;
}
