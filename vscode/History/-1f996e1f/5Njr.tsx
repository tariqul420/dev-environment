interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disable?: boolean;
}

export function InputField({ name, label, placeholder, type, disable }: Props) {
  return <div>input-field</div>;
}
