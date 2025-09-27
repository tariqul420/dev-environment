"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../globals/search-bar";
import { Badge } from "../ui/badge";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );
  const pulse = true;
  const subtle = true;
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Online/Offline
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const formattedTime = format(currentTime, "PPP · p");
  const color = isOnline ? "emerald" : "rose";

  return (
    <header className="border-border bg-card/80 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="cursor-pointer" />

          {/* Divider */}
          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* System Status */}
          <Badge
            variant="secondary"
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset",
              subtle
                ? isOnline
                  ? "bg-emerald-950/70 text-emerald-300 ring-emerald-500/30"
                  : "bg-rose-950/70 text-rose-300 ring-rose-500/30"
                : isOnline
                  ? "bg-emerald-600/15 text-emerald-300 ring-emerald-400/30"
                  : "bg-rose-600/15 text-rose-300 ring-rose-400/30",
              "transition-colors",
            )}
            title={`System ${isOnline ? "Online" : "Offline"}`}
          >
            {/* Dot + optional ping */}
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              {pulse && (
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
                    isOnline ? "bg-emerald-400" : "bg-rose-400",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  isOnline ? "bg-emerald-400" : "bg-rose-400",
                )}
              />
            </span>

            {/* Text */}
            <span className="tracking-wide">
              System{" "}
              <span className="font-bold">
                {isOnline ? "Online" : "Offline"}
              </span>
            </span>
          </Badge>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <SearchBar placeholder="Search logs, APIs..." />

          {/* Notifications */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                  {/* unread dot */}
                  <span
                    aria-hidden
                    className="outline-background absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 outline"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </header>
  );
}
