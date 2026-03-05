"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, TrendingUp, type LucideIcon } from "lucide-react";
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
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {item.label}
              </Link>
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
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2.5 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
