"use client";

import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { AlignLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCart from "@/lib/hooks/use-cart";
import { cn } from "@/lib/utils";
import Logo from "../global/logo";
import { ModeToggle } from "../global/mode-toggle";

type Role = "ADMIN" | "STAFF" | "USER" | undefined;

function MiniCart() {
  const { items, subtotal } = useCart();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-auto py-4">
        {items.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">
            Your cart is empty.
          </p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 px-2">
              <div className="relative h-12 w-12 overflow-hidden rounded">
                <Image
                  src={it.image ?? "/placeholder.png"}
                  alt={it.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{it.title}</p>
                <p className="text-xs text-muted-foreground">
                  {it.qty} × {it.price} ৳
                </p>
              </div>
              <div className="text-sm font-semibold">
                {(it.qty * it.price).toFixed(2)} ৳
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-semibold">{subtotal.toFixed(2)} ৳</span>
        </div>
        <div className="flex gap-2">
          <SheetClose asChild>
            <Link href="/cart" className="w-1/2">
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/checkout" className="w-1/2">
              <Button className="w-full">Checkout</Button>
            </Link>
          </SheetClose>
        </div>
      </div>
    </div>
  );
}

function CartButton() {
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const onCartClick = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      router.push("/cart");
    } else {
      setOpen(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCartClick}
        className="relative"
        aria-label="Open cart"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <ShoppingCart />
        {count > 0 && (
          <Badge
            className="absolute -right-1 -top-1 h-5 min-w-[1.25rem] px-1 text-[10px] leading-4"
            variant="default"
          >
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </Button>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
        </SheetHeader>
        <MiniCart />
      </SheetContent>
    </Sheet>
  );
}

function dashboardHref(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/staff";
    case "USER":
      return "/customer";
    default:
      return "/customer";
  }
}

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    let active = true;
    const loadRole = async () => {
      try {
        const res = await fetch("/api/user/role", { cache: "no-store" });
        const data = await res.json();
        if (active) setRole(data.role);
      } catch (err) {
        console.error("Failed to fetch role:", err);
      }
    };
    loadRole();
    return () => {
      active = false;
    };
  }, []);

  const [navbarState, setNavbarState] = useState({
    showNavbar: true,
    lastScrollY: 0,
  });

  const isActive = useCallback(
    (path: string) =>
      path === "/" ? pathname === "/" : pathname?.startsWith(path),
    [pathname],
  );

  const navLinks = useMemo(
    () =>
      [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/blogs", label: "Blogs" },
        { href: "/about-us", label: "About Us" },
        { href: "/contact-us", label: "Contact" },
        isSignedIn
          ? {
              href: dashboardHref(role),
              label:
                role === "ADMIN"
                  ? "Admin"
                  : role === "STAFF"
                    ? "Staff"
                    : "Dashboard",
            }
          : false,
      ].filter((link): link is { href: string; label: string } =>
        Boolean(link),
      ),
    [isSignedIn, role],
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavbarState((prev) => ({
        showNavbar: currentScrollY < prev.lastScrollY || currentScrollY < 10,
        lastScrollY: currentScrollY,
      }));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 z-[20] w-full border-b bg-gradient-to-r from-background/60 to-background/60 p-4 shadow backdrop-blur-3xl transition-transform duration-300",
        navbarState.showNavbar ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="mx-auto flex w-[90vw] max-w-7xl items-center justify-between md:ps-5">
        {/* Logo */}
        <Logo tClass="hidden lg:block" />

        {/* Desktop Navigation */}
        <ul className="hidden space-x-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative px-1 text-sm font-medium transition-colors duration-300"
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-[1.5px] origin-left rounded-full bg-foreground transition-all duration-300 dark:bg-light",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <CartButton />

          {/* Login Button */}
          <div className="hidden md:flex">
            <SignedOut>
              <Link href="/sign-in" className="font-medium">
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer text-center"
                >
                  Login / Register
                </Button>
              </Link>
            </SignedOut>
          </div>

          {/* User */}
          <SignedIn>
            <Suspense
              fallback={
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              }
            >
              <UserButton afterSignOutUrl="/" />
            </Suspense>
          </SignedIn>

          {/* Theme toggle */}
          <ModeToggle />

          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild aria-label="Open menu">
              <button
                type="button"
                className="cursor-pointer rounded px-1 py-1 lg:hidden"
                aria-haspopup="dialog"
                aria-expanded="false"
              >
                <AlignLeft />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="animate-slide-in border-none px-2"
            >
              <SheetHeader className="w-fit px-2">
                <SheetTitle className="flex items-center gap-2 text-2xl font-medium">
                  <Image
                    src="/assets/icon-transparent.png"
                    alt="Natural Sefa"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  Natural Sefa
                </SheetTitle>
              </SheetHeader>
              <hr />
              <ul className="mt-4 flex flex-col space-y-4 px-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "group relative px-1 text-base font-medium",
                          isActive(link.href) && "font-semibold",
                        )}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {link.label}
                        <span
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-[1.5px] origin-left rounded-full bg-foreground transition-all duration-300 dark:bg-light",
                            isActive(link.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full",
                          )}
                        />
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 space-y-2 md:hidden">
                <SignedOut>
                  <li className="px-2">
                    <SheetClose asChild>
                      <Link href="/sign-in">
                        <Button
                          className="w-full text-center"
                          variant="outline"
                        >
                          Login / Register
                        </Button>
                      </Link>
                    </SheetClose>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li className="px-2">
                    <SheetClose asChild>
                      <SignOutButton>
                        <Button
                          className="w-full text-center"
                          variant="destructive"
                        >
                          Sign Out
                        </Button>
                      </SignOutButton>
                    </SheetClose>
                  </li>
                </SignedIn>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
