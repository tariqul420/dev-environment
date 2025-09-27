"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { Bell, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../globals/search-bar";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  // live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // online/offline status
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

  const formattedTime = format(currentTime, "PPpp", {
    timeZone: "Asia/Dhaka",
  });

  return (
    <header className="bg-card border-border w-full border-b shadow-sm">
      <nav className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="cursor-pointer" />

          {/* Time */}
          <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
            <Clock size={14} className="text-primary" />
            <span>{formattedTime}</span>
          </div>

          {/* System Status */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-inset ${
              isOnline
                ? "bg-green-950/70 text-green-300 ring-green-500/30"
                : "bg-red-950/70 text-red-300 ring-red-500/30"
            }`}
          >
            {/* Pulse Dot */}
            <span
              className={`relative flex h-2.5 w-2.5 items-center justify-center`}
            >
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline
                    ? "animate-ping bg-green-400"
                    : "animate-ping bg-red-400"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              />
            </span>

            {/* Status Text */}
            <span className="tracking-wide">
              System{" "}
              <span className="font-bold">
                {isOnline ? "Online" : "Offline"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <SearchBar placeholder="Search logs, APIs..." />

          {/* Bell */}
          <div className="relative cursor-pointer">
            <Bell className="text-muted-foreground h-6 w-6 transition-colors hover:text-blue-400" />
            <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500" />
          </div>
        </div>
      </nav>
    </header>
  );
}
