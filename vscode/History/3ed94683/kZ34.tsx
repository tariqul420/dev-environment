import {
  BarChart3,
  Bell,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const staffActions = [
  {
    title: "New Order",
    description: "Create new order",
    icon: Plus,
    href: "/admin/orders/new",
    color: "bg-green-500",
  },
  {
    title: "Search Orders",
    description: "Find specific orders",
    icon: Search,
    href: "/admin/orders",
    color: "bg-blue-500",
  },
  {
    title: "Update Status",
    description: "Update order status",
    icon: RefreshCw,
    href: "/admin/orders",
    color: "bg-orange-500",
  },
  {
    title: "Notifications",
    description: "View notifications",
    icon: Bell,
    href: "/admin/notifications",
    color: "bg-purple-500",
  },
  {
    title: "Support Chat",
    description: "Customer support",
    icon: MessageSquare,
    href: "/admin/support",
    color: "bg-pink-500",
  },
  {
    title: "Reports",
    description: "View reports",
    icon: BarChart3,
    href: "/admin/reports",
    color: "bg-indigo-500",
  },
  {
    title: "Documentation",
    description: "Help & guides",
    icon: FileText,
    href: "/admin/docs",
    color: "bg-gray-500",
  },
  {
    title: "Settings",
    description: "Account settings",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-slate-500",
  },
];

export default function StaffQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {staffActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto flex-col gap-2 p-4 hover:bg-muted/50 w-full"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
