"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Headphones,
  Loader2,
  PackageCheck,
  Server,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type Role = "admin" | "customer";
type NotificationType = "order" | "stock" | "system" | "support";

interface NotificationItem<TMeta = unknown> {
  _id: string;
  type: NotificationType;
  title: string;
  message?: string;
  createdAt: string;
  read?: boolean;
  href?: string;
  meta?: Record<string, TMeta>;
}

function TypeIcon({ type }: { type: NotificationType }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "order":
      return <PackageCheck className={cls} />;
    case "stock":
      return <AlertTriangle className={cls} />;
    case "system":
      return <Server className={cls} />;
    case "support":
      return <Headphones className={cls} />;
    default:
      return <Bell className={cls} />;
  }
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const MOCK_NOTIFS: NotificationItem[] = [
  // {
  //   _id: "n1",
  //   type: "order",
  //   title: "New order #A1029",
  //   message: "Methi Mix Plus (2x) — ৳1290",
  //   createdAt: new Date(Date.now() - 60_000).toISOString(),
  //   read: false,
  //   href: "/dashboard/orders/A1029",
  //   meta: { orderId: "A1029", amount: 1290 },
  // },
  // {
  //   _id: "n2",
  //   type: "system",
  //   title: "Server back online",
  //   message: "Everything looks healthy.",
  //   createdAt: new Date(Date.now() - 6 * 60_000).toISOString(),
  //   read: false,
  // },
  // {
  //   _id: "n3",
  //   type: "stock",
  //   title: "Low stock: Methi Mix Plus",
  //   message: "Only 12 units left. Consider restocking.",
  //   createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
  //   read: true,
  // },
  // {
  //   _id: "n4",
  //   type: "support",
  //   title: "New support ticket",
  //   message: "Customer: Delay in delivery (Order #A1017)",
  //   createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  //   read: true,
  //   href: "/dashboard/support/A1017",
  // },
];

export default function NotificationsDropdown({
  role = "admin",
}: {
  role?: Role;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const unread = items.filter((i) => !i.read).length;

  // Simulated loading via setTimeout
  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const t = setTimeout(() => {
      if (!isMounted) return;
      const filtered =
        role === "admin"
          ? MOCK_NOTIFS
          : MOCK_NOTIFS.filter((n) => n.type !== "stock");
      setItems(filtered);
      setLoading(false);
    }, 900); // ~0.9s fake latency

    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, [role]);

  const markRead = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, read: true } : i)),
    );
  };

  const markAll = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span
            aria-hidden
            className={cn(
              "absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full",
              unread ? "bg-red-500" : "bg-transparent",
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm">
            Notifications
          </DropdownMenuLabel>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">
                {unread} unread
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={markAll}
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark all
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <ScrollArea className="max-h-[360px]">
          <div className="p-1">
            {!loading && items.length === 0 && (
              <div className="text-muted-foreground px-3 py-8 text-center text-sm">
                No notifications
              </div>
            )}

            {loading &&
              // skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="flex items-start gap-3 rounded-md px-3 py-3"
                >
                  <div className="bg-muted h-7 w-7 animate-pulse rounded-md" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="bg-muted h-3 w-40 animate-pulse rounded" />
                      <div className="bg-muted h-2.5 w-10 animate-pulse rounded" />
                    </div>
                    <div className="bg-muted h-2.5 w-56 animate-pulse rounded" />
                  </div>
                </div>
              ))}

            {!loading &&
              items.map((n) => (
                <DropdownMenuItem
                  key={n._id}
                  className={cn(
                    "group flex items-start gap-3 rounded-md px-3 py-3",
                    !n.read ? "bg-muted/40" : "",
                  )}
                  onClick={() => {
                    markRead(n._id);
                    if (n.href) window.location.href = n.href;
                  }}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded-md p-1.5",
                      n.type === "order" &&
                        "bg-emerald-500/10 text-emerald-500",
                      n.type === "stock" && "bg-amber-500/10 text-amber-600",
                      n.type === "system" && "bg-sky-500/10 text-sky-500",
                      n.type === "support" &&
                        "bg-violet-500/10 text-violet-500",
                    )}
                  >
                    <TypeIcon type={n.type} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={cn(
                          "truncate text-sm",
                          !n.read ? "font-semibold" : "font-medium",
                        )}
                      >
                        {n.title}
                      </p>
                      <span className="text-muted-foreground shrink-0 text-[10px]">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    {n.message ? (
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                        {n.message}
                      </p>
                    ) : null}
                  </div>
                </DropdownMenuItem>
              ))}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              toast.info(
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-blue-500">
                    Feature Coming Soon
                  </span>
                  <span className="text-muted-foreground text-xs">
                    The detailed notifications page is not ready yet.
                  </span>
                </div>,
                {
                  duration: 3000,
                  className: "bg-blue-50 border border-blue-200",
                },
              )
            }
          >
            View all
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
