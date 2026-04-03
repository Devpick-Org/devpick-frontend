import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginRequiredEmptyStateProps {
  title?: string;
  description?: string;
}

/**
 * 로그인이 필요한 페이지(히스토리, 리포트, 프로필)에서
 * 비로그인 사용자에게 보여주는 빈 상태 컴포넌트.
 *
 * 사용 예)
 * ```tsx
 * if (!isAuthenticated) return <LoginRequiredEmptyState />
 * ```
 */
export function LoginRequiredEmptyState({
  title = "로그인이 필요합니다",
  description = "이 페이지는 로그인 후 이용할 수 있습니다.",
}: LoginRequiredEmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Lock className="h-7 w-7 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground font-medium">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href="/auth">로그인 / 회원가입</Link>
        </Button>
        <Button variant="outline" className="hover:bg-secondary hover:text-foreground" asChild>
          <Link href="/home">피드 둘러보기</Link>
        </Button>
      </div>
    </div>
  );
}
