import { cn } from "@/lib/utils/utils";
import Link from "next/link";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-1 text-2xl font-semibold",
        className,
      )}
    >
      {/* Leaf Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-500 dark:text-green-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C10.343 5.333 8.408 7.236 6 8c1.61 1.3 2.5 3.8 2.5 6.5a7.5 7.5 0 0015 0c0-6.075-4.925-11-11.5-11z" />
      </svg>

      {/* Brand Name */}
      <span className="font-serif text-green-700 italic dark:text-green-300">
        Natural
      </span>
      <span className="font-sans font-bold text-emerald-900 dark:text-emerald-100">
        Sefa
      </span>
    </Link>
  );
};
