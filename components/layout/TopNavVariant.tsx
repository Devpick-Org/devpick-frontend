"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut, Home, Users, TrendingUp, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

// 로고 컴포넌트
function DevPickLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "입문", JUNIOR: "주니어", MIDDLE: "미들", SENIOR: "시니어",
};

// 사이드바에 있던 메뉴들을 이쪽으로 가져옵니다.
const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/report", label: "리포트", icon: TrendingUp },
];

export function TopNavVariant() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const displayName = user?.nickname ?? "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayLevel = user?.level ? (LEVEL_LABELS[user.level] ?? user.level) : null;

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-card">
        {/* relative 속성을 추가해서 중앙 정렬의 기준점이 되게 합니다 */}
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/15">
                <DevPickLogo className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">DevPick</span>
            </Link>
          </div>  

        {/* Desktop Navigation Links (가로 배치) */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-16 md:flex">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // 배경색 관련 클래스(bg-primary/10, hover:bg-secondary)를 모두 제거했습니다.
                "flex items-center gap-2 text-sm transition-colors duration-200",
                isActive
                  ? "font-bold text-primary" // 활성화: 굵은 파란색 글씨
                  : "font-medium text-muted-foreground hover:text-foreground" // 비활성화: 회색 글씨, 호버 시 밝아짐
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
              );
            })}
          </nav>
         

          {/* Right: User area (기존과 동일) */}
          <div className="flex items-center">
          {!mounted ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : (
            <DropdownMenu modal={false}>
              {/*
               * asChild 제거 — DropdownMenuTrigger 자체를 직접 스타일링
               * asChild + Button 중첩 시 Radix Slot이 ref를 잃어 <button><button> 중첩 발생 가능
               */}
              <DropdownMenuTrigger
                className="flex h-auto items-center gap-2.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  asChild
                  className="focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
                >
                  <Link href="/profile">
                    <User />내 프로필
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
                >
                  <LogOut />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          </div>
        </div>
      </header>

      {/* 모바일 하단 탭 (기존 사이드바에 있던 걸 이쪽으로 옮겨옴) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/80 backdrop-blur-xl md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2.5 text-xs font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
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