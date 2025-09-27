import {
  FileText,
  Heart,
  HelpCircle,
  MessageSquare,
  Package,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  {
    title: "Browse Products",
    description: "Explore our latest collection",
    icon: ShoppingBag,
    href: "/products",
    color: "bg-blue-500",
  },
  {
    title: "My Orders",
    description: "Track your orders",
    icon: Package,
    href: "/customer/orders",
    color: "bg-green-500",
  },
  {
    title: "Support",
    description: "Get help & support",
    icon: MessageSquare,
    href: "/contact-us",
    color: "bg-purple-500",
  },
  {
    title: "Wishlist",
    description: "Your saved items",
    icon: Heart,
    href: "/wishlist",
    color: "bg-red-500",
  },
  {
    title: "FAQs",
    description: "Common questions",
    icon: HelpCircle,
    href: "/faqs",
    color: "bg-orange-500",
  },
  {
    title: "Privacy Policy",
    description: "Your data & privacy",
    icon: FileText,
    href: "/privacy-policy",
    color: "bg-gray-500",
  },
];

export default function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto flex-col gap-2 p-4 hover:bg-muted/50"
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
