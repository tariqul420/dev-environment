import { ShoppingCart, Heart, Package, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActionsPanel() {
  const quickActions = [
    {
      title: "নতুন অর্ডার",
      description: "পণ্য ব্রাউজ করুন",
      icon: ShoppingCart,
      href: "/products",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "কার্ট দেখুন",
      description: "আপনার কার্ট চেক করুন",
      icon: Package,
      href: "/cart",
      color: "text-green-600 bg-green-50 dark:bg-green-950",
    },
    {
      title: "সাপোর্ট",
      description: "সহায়তা পান",
      icon: Phone,
      href: "tel:+8809647001177",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "লাইভ চ্যাট",
      description: "তাৎক্ষণিক সাহায্য",
      icon: MessageCircle,
      href: "/contact-us",
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          দ্রুত অ্যাকশন
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors"
              >
                <div className={`p-3 rounded-full ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}