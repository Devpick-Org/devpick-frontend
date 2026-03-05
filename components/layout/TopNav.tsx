"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
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

  const showUser = mounted && user !== null;
  const displayName = user?.nickname ?? "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayLevel = user?.level ? (LEVEL_LABELS[user.level] ?? user.level) : null;

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
            <DevPickLogo className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            DevPick
          </span>
        </Link>

        {/* Right: User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 transition-colors hover:bg-secondary"
              aria-label="User menu"
            >
              {showUser ? (
                <>
                  <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                    <AvatarImage
                      src={user?.profileImageUrl ?? ""}
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
                  <ChevronDownIcon className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                </>
              ) : (
                <>
                  <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
                  <div className="hidden items-center gap-1.5 sm:flex">
                    <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                  </div>
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="gap-2 text-foreground">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                내 프로필
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="gap-2 text-foreground cursor-pointer"
              onSelect={() => handleLogout()}
            >
              <LogOutIcon className="h-4 w-4 text-muted-foreground" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
