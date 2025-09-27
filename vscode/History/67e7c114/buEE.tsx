import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({tClass}: {tClass?: string}) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/logo-transparent.png"
        alt="Natural Sefa"
        width={35}
        height={35}
        className="rounded"
      />
      <span className={cn("text-xl font-semibold text-primary", tClass)}>
        {/* <span className="text-2xl">N</span>atural{" "}
        <span className="text-2xl">S</span>efa */}
        নাতুরাল সেফা
      </span>
    </Link>
  );
}
