import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function TextareaField({ name, label, placeholder, className, minHeight }: Props) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} className={cn('w-full', minHeight)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
