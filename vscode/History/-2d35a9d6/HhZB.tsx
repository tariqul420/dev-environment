import { InputField } from '@/components/shared/form-fields/input-field';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ColorFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

export function ColorField({ id, label, value, onChange, className }: ColorFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={`${id}-hex`} className="block">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <InputField id={`${id}-picker`} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="m-0" />
        <InputField id={`${id}-hex`} type="text" placeholder="#000000" value={value} onChange={(e) => onChange(e.target.value)} inputClassName="font-mono" className="m-0 flex-1" />
      </div>
    </div>
  );
}
