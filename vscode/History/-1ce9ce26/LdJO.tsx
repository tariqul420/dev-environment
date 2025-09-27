import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedShinyText } from './magicui/animated-shiny-text';

interface MagicButtonProps {
  href?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | 'shiny';
  onClick?: () => void;
}

const MagicButton: React.FC<MagicButtonProps> = ({ href, disabled = false, className, children = 'Navigate', type = 'button', onClick }) => {
  const buttonContent = (
    <div className="inline-flex items-center gap-2">
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  );

  if (type === 'shiny') {
    return (
      <div
        className={cn(
          'group inline-flex items-center justify-center rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70 disabled:pointer-events-none disabled:opacity-50',
          className,
        )}>
        <AnimatedShinyText className={cn('inline-flex items-center gap-2 text-foreground', { 'opacity-50 pointer-events-none': disabled })}>
          {href ? (
            <Link href={href}>{buttonContent}</Link>
          ) : (
            <button type="button" onClick={onClick} disabled={disabled} className="bg-transparent">
              {buttonContent}
            </button>
          )}
        </AnimatedShinyText>
      </div>
    );
  }

  return href ? (
    <Button asChild disabled={disabled} className={cn('group flex items-center gap-2', className)}>
      <Link href={href}>{buttonContent}</Link>
    </Button>
  ) : (
    <Button type={type} disabled={disabled} onClick={onClick} className={cn('group flex items-center gap-2', className)}>
      {buttonContent}
    </Button>
  );
};

export default MagicButton;
