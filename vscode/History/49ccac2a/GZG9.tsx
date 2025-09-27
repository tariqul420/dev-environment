import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Props {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({ name, label, disabled = false, className }: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <FormLabel className="ml-2">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
