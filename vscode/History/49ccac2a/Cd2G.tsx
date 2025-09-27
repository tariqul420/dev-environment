import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time';
  disable?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckboxField({ name, label, placeholder, type = 'text', disable = false, className, onChange }: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const { value, onChange: formOnChange, ...restField } = field;
        return (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Checkbox
                disabled={disable}
                checked={value}
                value={value || ''}
                onChange={(e) => {
                  const inputValue = type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;
                  formOnChange(inputValue);
                  if (onChange) onChange(e);
                }}
                {...restField}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
