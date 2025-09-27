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
import { format } from "date-fns";
import { Bell, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../globals/search-bar";
import { StatusBadge } from "../globals/status-badge";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  // Live clock
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

  return (
    <header className="border-border bg-card/80 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="cursor-pointer" />

          {/* Time */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-muted text-muted-foreground ring-border inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ring-1 ring-inset">
                  <Clock size={14} className="text-primary" />
                  <span className="tabular-nums">{formattedTime}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Local time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Divider */}
          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* System Status */}
          <StatusBadge online={isOnline} label="System" />
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
