import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ tClass }: { tClass?: string }) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/logo-transparent.png"
        alt="Natural Sefa"
        width={35}
        height={35}
        className="rounded"
      />
      <span
        className={cn(
          "text-2xl font-semibold text-primary font-bangle",
          tClass,
        )}
      >
        ন্যাচারাল শেফা
      </span>
    </Link>
  );
}
