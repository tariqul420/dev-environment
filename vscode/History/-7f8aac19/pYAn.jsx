"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
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

  return (
    <header className="bg-card border-border w-full border-b shadow-sm">
      <nav className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="cursor-pointer" />

          {/* Time */}
          <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm">
            <Clock size={14} className="text-primary" />
            <span>
              {currentTime.toLocaleString("en-US", {
                timeZone: "Asia/Dhaka",
                hour12: true,
              })}
            </span>
          </div>

          {/* System Status */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isOnline
                ? "bg-green-900/80 text-green-300"
                : "bg-red-900/80 text-red-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? "animate-pulse bg-green-400" : "bg-red-400"
              }`}
            />
            <span>System {isOnline ? "Online" : "Offline"}</span>
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
