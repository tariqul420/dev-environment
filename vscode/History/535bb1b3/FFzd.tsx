"use client";

import Link from "next/link";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ToolsData } from "@/data/tools";
import { NavMain } from "./nav-tools";
import Image from "next/image";

export function ToolsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <Link href={"/"}>
        <SidebarHeader className="px-3 py-4 border-b">
          {state === "collapsed" ? (
            <div className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                TH
              </div>
            </div>
          ) : (
            <Link href="/" className="inline-flex items-center font-semibold">
              <Image
                src="/assets/logo-transplant.png"
                height={40}
                width={40}
                alt="Tools Hub Logo"
              />
              <span>Tools Hub</span>
            </Link>
          )}
        </SidebarHeader>
      </Link>

      {/* Content */}
      <SidebarContent>
        <NavMain items={ToolsData} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
