"use client";

import { useHydrated } from "@/lib/hooks/useHydrated";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  User,
  LogOut,
  Home,
  Users,
  TrendingUp,
  Flame,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
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
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { cn } from "@/lib/utils";

// 로고 컴포넌트
function TraceLogo({ className }: { className?: string }) {
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

// 사이드바에 있던 메뉴들을 이쪽으로 가져옵니다.
const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/trends", label: "트렌드", icon: Flame },
  { href: "/history", label: "히스토리", icon: BookOpen },
  { href: "/report", label: "리포트", icon: TrendingUp },
];

export function TopNavVariant() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const mounted = useHydrated();

  const displayName = user?.nickname ?? "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayBadge = user?.representativeBadge?.name ?? null;

  const handleLogout = async () => {
    try {
      await authEndpoints.logout();
    } catch {
      // 로그아웃 API 실패 시에도 클라이언트 상태는 초기화
    } finally {
      clearAuth();
      router.push("/");
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-card shadow-md shadow-black/1">
        {/* relative 속성을 추가해서 중앙 정렬의 기준점이 되게 합니다 */}
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* [왼쪽 영역] Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/15">
                <TraceLogo className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Trace
              </span>
            </Link>
          </div>

          {/* [오른쪽 영역] 네비게이션 메뉴 + 유저 프로필*/}
          <div className="flex items-center gap-8">
            {" "}
            {/* gap-8로 메뉴와 유저 프로필 사이 간격 조절 */}
            {/* 1. 네비게이션 (absolute 제거, 일반 flex로 변경) */}
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 text-sm transition-colors duration-200",
                      isActive
                        ? "font-semibold text-primary"
                        : "font-medium text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {/* 2. 프로필 영역 */}
            <div className="flex items-center">
              {!mounted ? (
                <Skeleton className="h-9 w-9 rounded-full" />
              ) : !user ? (
                <Link
                  href="/auth"
                  className="flex h-auto items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  로그인
                </Link>
              ) : (
                <DropdownMenu modal={false}>
                  {/*
                   * asChild 제거 — DropdownMenuTrigger 자체를 직접 스타일링
                   * asChild + Button 중첩 시 Radix Slot이 ref를 잃어 <button><button> 중첩 발생 가능
                   */}
                  <DropdownMenuTrigger
                    className="flex h-auto items-center gap-2.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-sm transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                    aria-label="User menu"
                  >
                    <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                      <AvatarImage
                        src={user.profileImage ?? ""}
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
                      {displayBadge && (
                        <Badge
                          variant="secondary"
                          className="max-w-[80px] truncate border-0 bg-primary/10 text-[11px] font-semibold text-primary px-2.5 py-[3px] leading-none"
                        >
                          {displayBadge}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <User />내 프로필
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="font-medium cursor-pointer"
                    >
                      <LogOut />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 하단 탭 (기존 사이드바에 있던 걸 이쪽으로 옮겨옴) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/80 backdrop-blur-xl md:hidden">
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
