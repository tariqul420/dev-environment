"use client";

import {
  FolderKanban,
  LayoutDashboard,
  MoreVerticalIcon,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Map of icon names to their corresponding components
const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
};

export function DashboardSidebar({ menu = [], user }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  // Function to determine if a menu item is active
  const isActive = (url) => {
    if (!url) return false;
    // Exact match for dashboard routes
    if (["/admin"].includes(url)) {
      return pathname === url;
    }
    // Partial match for other routes
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => {
                const IconComponent = iconMap[item?.icon];

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`dark:hover:bg-dark-lite hover:bg-gray-100 ${isActive(item?.url) ? "dark:bg-dark-lite bg-gray-100" : ""}`}
                      asChild
                    >
                      <Link
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggleSidebar();
                          }
                        }}
                        href={item?.url || "#"}
                        className=""
                      >
                        {IconComponent ? <IconComponent /> : null}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-muted/50 flex items-center justify-between border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-muted flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-left text-sm leading-tight">
                  <div className="font-medium">{user?.name || "Admin"}</div>
                  <div className="text-muted-foreground max-w-[140px] truncate text-xs">
                    {user?.email}
                  </div>
                </div>
              </div>

              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="end" className="w-52">
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
