import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time';
  disable?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isForm?: boolean;
}

export function InputField({ name, label, placeholder, type = 'text', disable = false, className, onChange, isForm = true }: Props) {
  const InputEl = (field?: any) => {
    const { value, onChange: formOnChange, ...restField } = field || {};
    return (
        <FormLabel>{label}</FormLabel>
      <Input
        placeholder={placeholder}
        type={type}
        disabled={disable}
        inputMode={type === 'number' ? 'decimal' : undefined}
        value={value ?? ''}
        onChange={(e) => {
          const inputValue = type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;

          if (formOnChange) formOnChange(inputValue);
          if (onChange) onChange(e);
        }}
        {...restField}
      />
    );
  };

  if (!isForm) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium mb-1">{label}</label>
        {InputEl()}
      </div>
    );
  }

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="bg-light font-grotesk flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent">{InputEl(field)}</div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
