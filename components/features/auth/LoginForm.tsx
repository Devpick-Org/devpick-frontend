"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  isLoading?: boolean
}

export function LoginForm({ isLoading }: LoginFormProps) {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email" className="text-foreground">{"이메일"}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          required
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-foreground">{"비밀번호"}</Label>
          <button
            type="button"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {"비밀번호 찾기"}
          </button>
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          required
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-11 w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {"로그인 중..."}
          </span>
        ) : (
          "로그인"
        )}
      </Button>
    </form>
  )
}
