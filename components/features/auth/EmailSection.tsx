"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockAuthEndpoints } from "@/lib/api/endpoints/auth"

const TIMER_DURATION = 180 // 3분

interface EmailSectionProps {
  email: string
  emailError: string
  onEmailChange: (value: string) => void
  /** 닉네임 유효 AND 이메일 형식 유효 시 true — 인증번호 발송 버튼 활성화 조건 */
  canSendCode: boolean
  onVerified: (email: string) => void
}

export function EmailSection({
  email,
  emailError,
  onEmailChange,
  canSendCode,
  onVerified,
}: EmailSectionProps) {
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationError, setVerificationError] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(TIMER_DURATION)

  // 이메일이 바뀌면 인증 관련 상태를 초기화
  const prevEmailRef = useRef(email)
  useEffect(() => {
    if (prevEmailRef.current !== email) {
      setIsCodeSent(false)
      setIsEmailVerified(false)
      setVerificationCode("")
      setVerificationError(false)
      setTimerSeconds(TIMER_DURATION)
      prevEmailRef.current = email
    }
  }, [email])

  // 카운트다운 타이머
  useEffect(() => {
    if (!isCodeSent || isEmailVerified || timerSeconds <= 0) return
    const interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [isCodeSent, isEmailVerified, timerSeconds])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const handleSendCode = async () => {
    setIsSendingCode(true)
    setVerificationError(false)
    try {
      await mockAuthEndpoints.sendEmailCode(email)
      setIsCodeSent(true)
      setTimerSeconds(TIMER_DURATION)
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || timerSeconds === 0) return
    setIsVerifying(true)
    setVerificationError(false)
    try {
      await mockAuthEndpoints.verifyEmailCode(email, verificationCode)
      setIsEmailVerified(true)
      onVerified(email)
    } catch {
      setVerificationError(true)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 이메일 입력 + 인증번호 발송 */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="signup-email" className="text-foreground">{"이메일"}</Label>
        <div className="flex gap-2">
          <Input
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isEmailVerified}
            className="h-11 flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary disabled:opacity-60"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleSendCode}
            disabled={!canSendCode || isSendingCode || isEmailVerified}
            className="h-11 shrink-0 border border-border bg-secondary text-foreground hover:bg-secondary/80 hover:border-primary/40 transition-all duration-200 disabled:opacity-50"
          >
            {isSendingCode ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : isCodeSent && !isEmailVerified ? (
              "재발송"
            ) : (
              "인증번호 발송"
            )}
          </Button>
        </div>
        <p className="h-5 text-sm text-destructive">{emailError}</p>
      </div>

      {/* 인증번호 입력 — 코드 발송 후 표시 */}
      {isCodeSent && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="verification-code" className="text-foreground">{"인증번호"}</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="verification-code"
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value)
                  setVerificationError(false)
                }}
                maxLength={6}
                disabled={isEmailVerified}
                className="h-11 pr-16 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary disabled:opacity-60"
              />
              {!isEmailVerified && timerSeconds > 0 && (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono ${
                    timerSeconds <= 30 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(timerSeconds)}
                </span>
              )}
              {!isEmailVerified && timerSeconds === 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-destructive">
                  {"만료됨"}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleVerifyCode}
              disabled={!verificationCode || isVerifying || isEmailVerified || timerSeconds === 0}
              className={`h-11 shrink-0 border transition-all duration-200 disabled:opacity-50 ${
                isEmailVerified
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  : "border-border bg-secondary text-foreground hover:bg-secondary/80 hover:border-primary/40"
              }`}
            >
              {isVerifying ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              ) : isEmailVerified ? (
                <span className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4" />
                  {"완료"}
                </span>
              ) : (
                "인증 확인"
              )}
            </Button>
          </div>

          {/* 에러/성공 메시지가 같은 슬롯을 공유해 레이아웃 이동 방지 */}
          <p className={`h-5 text-sm ${isEmailVerified ? "text-emerald-500" : "text-destructive"}`}>
            {verificationError
              ? "인증번호가 일치하지 않습니다."
              : isEmailVerified
                ? "이메일 인증이 완료되었습니다."
                : ""}
          </p>
        </div>
      )}
    </div>
  )
}
