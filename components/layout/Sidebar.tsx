"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, TrendingUp, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/report", label: "리포트", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 z-40 hidden w-[220px] border-r border-border bg-card/80 backdrop-blur-xl md:block">
        <nav
          className="flex flex-col gap-1 px-3 pt-6"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full h-auto justify-start gap-3 rounded-xl px-4 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/80 backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "h-auto flex-col gap-1 rounded-none px-4 py-2.5 text-xs font-medium",
                isActive
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </>
  );
}
