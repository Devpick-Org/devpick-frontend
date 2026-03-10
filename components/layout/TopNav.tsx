"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";

function DevPickLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  MIDDLE: "미들",
  SENIOR: "시니어",
};

export function TopNav() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = user?.nickname ?? "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayLevel = user?.level
    ? (LEVEL_LABELS[user.level] ?? user.level)
    : null;

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <DevPickLogo className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            DevPick
          </span>
        </Link>

        {/* Right: User Profile Dropdown — SSR 단계에서는 Skeleton으로 대체 (Radix UI ID 불일치 방지) */}
        {!mounted ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto gap-2.5 rounded-xl border-border bg-secondary/50 px-3 py-1.5 hover:bg-secondary"
                aria-label="User menu"
              >
                {user ? (
                  <>
                    <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                      <AvatarImage
                        src={user.profileImageUrl ?? ""}
                        alt={`${displayName} avatar`}
                      />
                      <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                        {displayInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <span className="text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                      {displayLevel && (
                        <Badge
                          variant="secondary"
                          className="border border-primary/20 bg-primary/10 text-[10px] font-semibold text-primary"
                        >
                          {displayLevel}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                  </>
                ) : (
                  <>
                    <div className="h-7 w-7 rounded-full bg-muted" />
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <div className="h-4 w-14 rounded bg-muted" />
                      <div className="h-4 w-10 rounded bg-muted" />
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User />내 프로필
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
