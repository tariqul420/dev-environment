import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";

const MagicButton = ({
  href,
  disabled = false,
  className,
  children = "Navigate",
  type = "button",
  onClick,
}) => {
  const buttonContent = (
    <div className="inline-flex items-center gap-2">
      {children}
      {type === "shiny" ? (
        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      ) : (
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      )}
    </div>
  );

  if (type === "shiny") {
    return (
      <div
        className={cn(
          "group rounded-md border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
          className,
        )}
      >
        <AnimatedShinyText
          className={cn(
            "inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400",
            {
              "pointer-events-none opacity-50": disabled,
            },
          )}
        >
          {href ? (
            <Link href={href}>{buttonContent}</Link>
          ) : (
            <button onClick={onClick} disabled={disabled}>
              {buttonContent}
            </button>
          )}
        </AnimatedShinyText>
      </div>
    );
  }

  return href ? (
    <Button
      asChild
      disabled={disabled}
      className={cn(
        "group flex items-center justify-center gap-2 transition-all duration-300",
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
        "group flex cursor-pointer items-center justify-center gap-2 transition-all duration-300",
        className,
      )}
    >
      {buttonContent}
    </Button>
  );
};

export default MagicButton;
