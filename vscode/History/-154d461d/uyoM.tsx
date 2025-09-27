'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectFieldProps {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SelectField({ name, label, options, placeholder = 'Select an option', disabled = false, className }: SelectFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
             <div className="bg-light font-grotesk flex items-center gap-2 overflow-hidden rounded-md dark:bg-transparent">
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
               
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
