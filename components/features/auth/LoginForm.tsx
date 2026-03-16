"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authEndpoints } from "@/lib/api/endpoints/auth"
import { useAuthStore } from "@/store/auth.store"
import { extractApiError, getAuthErrorMessage } from "@/lib/auth/getAuthErrorMessage"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/

interface LoginFormProps {
  isLoading?: boolean
}

export function LoginForm({ isLoading }: LoginFormProps) {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [authError, setAuthError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDisabled = isLoading || isSubmitting

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value === "") {
      setEmailError("")
    } else if (!EMAIL_REGEX.test(value)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.")
    } else {
      setEmailError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value === "") {
      setPasswordError("")
    } else if (!PASSWORD_REGEX.test(value)) {
      setPasswordError("비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자여야 합니다.")
    } else {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAuthError("")

    if (!email || !password || emailError || passwordError) return

    setIsSubmitting(true)
    try {
      const response = await authEndpoints.login({ email, password })
      const { accessToken, userId, nickname } = response.data.data
      // accessToken을 먼저 등록해야 이후 /users/me 요청에 Authorization 헤더가 붙음
      setAuth({ userId, email, nickname }, accessToken)

      // 로그인 응답에는 job/level/tags가 없으므로 /users/me로 전체 프로필 조회
      const { data: meData } = await authEndpoints.getMe()
      setAuth(meData.data, accessToken)

      router.push("/home")
    } catch (err) {
      const { code, message } = extractApiError(err)
      setAuthError(getAuthErrorMessage(code, message ?? "로그인 중 오류가 발생했습니다."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email" className="text-foreground">{"이메일"}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={handleEmailChange}
          disabled={isDisabled}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        <p className="h-5 text-sm text-red-500">{emailError}</p>
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
          value={password}
          onChange={handlePasswordChange}
          disabled={isDisabled}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        <p className="h-5 text-sm text-red-500">{passwordError}</p>
      </div>

      {authError && <p className="text-sm text-red-500">{authError}</p>}

      <Button
        type="submit"
        disabled={isDisabled}
        className="mt-2 h-11 w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20"
      >
        {isSubmitting ? (
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
