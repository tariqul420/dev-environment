import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface MyButtonProps {
  href?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({
  href,
  disabled = false,
  className,
  children = "Natural Sefa",
  type = "button",
  onClick,
}) => {
  const buttonContent = (
    <div className="inline-flex items-center gap-2">
      {children}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </div>
  );

  return href ? (
    <Button
      asChild
      disabled={disabled}
      className={cn(
        "group bg-accent-main hover:bg-accent-hover text-light flex items-center justify-center gap-2 transition-all duration-300",
        className,
      )}
    >
      <Link href={href}>{buttonContent}</Link>
    </Button>
  ) : (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group bg-accent-main hover:bg-accent-hover text-light flex cursor-pointer items-center justify-center gap-2 transition-all duration-300",
        className,
      )}
    >
      {buttonContent}
    </Button>
  );
};

export default MyButton;
