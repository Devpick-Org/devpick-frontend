"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailSection } from "./EmailSection"
import { mockAuthEndpoints } from "@/lib/api/endpoints/auth"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/

function validateNickname(value: string): string {
  if (value.length < 2 || value.length > 20) return "닉네임은 2~20자 사이여야 합니다."
  return ""
}

function validatePassword(value: string): string {
  if (value.length < 8 || value.length > 20) return "비밀번호는 8~20자 사이여야 합니다."
  if (!PASSWORD_REGEX.test(value)) return "영문, 숫자, 특수문자를 모두 포함해야 합니다."
  return ""
}

export function SignupForm() {
  const router = useRouter()

  const [nickname, setNickname] = useState("")
  const [nicknameError, setNicknameError] = useState("")

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 20
  const isEmailFormatValid = EMAIL_REGEX.test(email)

  /** 인증번호 발송 버튼 활성화 조건: 닉네임 AND 이메일 형식 모두 통과 */
  const canSendCode = isNicknameValid && isEmailFormatValid

  /** 가입하기 버튼 활성화 조건: 이메일 인증 완료 + 모든 필드 유효 */
  const isFormValid =
    !!verifiedEmail &&
    isNicknameValid &&
    isEmailFormatValid &&
    password.length > 0 &&
    !passwordError &&
    confirmPassword.length > 0 &&
    !confirmPasswordError

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setNicknameError(value ? validateNickname(value) : "")
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setVerifiedEmail(null)
    setEmailError(value && !EMAIL_REGEX.test(value) ? "올바른 이메일 형식이 아닙니다." : "")
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError(value ? validatePassword(value) : "")
    if (confirmPassword) {
      setConfirmPasswordError(value !== confirmPassword ? "비밀번호가 일치하지 않습니다." : "")
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    setConfirmPasswordError(value && value !== password ? "비밀번호가 일치하지 않습니다." : "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !verifiedEmail) return
    setIsSubmitting(true)
    try {
      await mockAuthEndpoints.signup({ email: verifiedEmail, password, nickname })
      router.push("/onboarding")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 닉네임 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-nickname" className="text-foreground">{"닉네임"}</Label>
        <Input
          id="signup-nickname"
          type="text"
          placeholder="사용할 닉네임을 입력해 주세요 (2~20자)"
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {nicknameError && <p className="text-sm text-destructive">{nicknameError}</p>}
      </div>

      {/* 이메일 인증 — canSendCode로 발송 버튼 제어 */}
      <EmailSection
        email={email}
        emailError={emailError}
        onEmailChange={handleEmailChange}
        canSendCode={canSendCode}
        onVerified={setVerifiedEmail}
      />

      {/* 비밀번호 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password" className="text-foreground">{"비밀번호"}</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="8~20자, 영문·숫자·특수문자 포함"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-confirm" className="text-foreground">{"비밀번호 확인"}</Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        className="mt-2 h-11 w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            {"가입 중..."}
          </span>
        ) : (
          "가입하기"
        )}
      </Button>
    </form>
  )
}
