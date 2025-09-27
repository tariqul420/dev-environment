import { cn } from "@/lib/utils/utils";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn("text-xl font-bold", className)}>
      Natural Sefa
    </Link>
  );
};
