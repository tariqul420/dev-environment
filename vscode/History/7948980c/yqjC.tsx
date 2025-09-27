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
import { ToolsData } from "@/data/tools";
import NavRight from "../shared/nav-right";

// Types
type ToolItem = {
  title: string;
  url: string;
  description?: string;
  popular?: boolean;
};

type FlatItem = ToolItem & {
  category: string;
  categoryUrl: string;
  icon?: unknown;
};

const RECENT_KEY = "tools-hub:recent-items-v1";
const MAX_RECENT = 8;

function asIcon(maybe: unknown): LucideIcon {
  return typeof maybe === "function" ? (maybe as LucideIcon) : Link2;
}

function flattenTools(data: typeof ToolsData): FlatItem[] {
  const out: FlatItem[] = [];
  for (const group of data) {
    if (!group?.isActive) continue;
    for (const item of group.items ?? []) {
      out.push({
        ...item,
        category: group.title,
        categoryUrl: group.url,
        icon: group.icon,
      });
    }
  }
  return out;
}

function addRecent(item: FlatItem) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const prev: FlatItem[] = raw ? JSON.parse(raw) : [];
    const filtered = prev.filter((p) => p.url !== item.url);
    const next = [item, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

function getRecent(): FlatItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as FlatItem[]) : [];
  } catch {
    return [];
  }
}

export default function ToolsHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const all = useMemo(() => flattenTools(ToolsData), []);
  

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/") {
        const t = e.target as HTMLElement;
        const tag = t?.tagName?.toLowerCase();
        const editable = t?.getAttribute?.("contenteditable") === "true";
        if (!editable && tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) setRecent(getRecent());
  }, [open]);

  function go(item: FlatItem) {
    addRecent(item);
    setOpen(false);
    router.push(item.url);
  }

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, FlatItem[]>();
    for (const item of all) {
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return map;
  }, [all]);

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
