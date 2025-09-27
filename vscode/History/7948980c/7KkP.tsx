"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Github, Link2, Linkedin, Search, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ToolsData } from "@/data/tools";
import NavRight from "../shared/nav-right";








export default function ToolsHeader() {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center border-b py-3 overflow-hidden border-b-muted/40 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-semibold tracking-tight">Tools Hub</h1>

        {/* Fake search control */}
        <NavRight />
      </div>
    </header>
  );
}
