"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmailSection } from "./EmailSection"
import { mockAuthEndpoints } from "@/lib/api/endpoints/auth"

const signupSchema = z
  .object({
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상이어야 합니다.")
      .max(20, "닉네임은 20자 이하여야 합니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(20, "비밀번호는 20자 이하여야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "영문, 숫자, 특수문자를 모두 포함해야 합니다."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const handleVerified = (email: string) => setVerifiedEmail(email)
  const handleEmailChange = () => setVerifiedEmail(null)

  const onSubmit = async (data: SignupFormValues) => {
    if (!verifiedEmail) return
    setIsSubmitting(true)
    try {
      await mockAuthEndpoints.signup({
        email: verifiedEmail,
        password: data.password,
        nickname: data.nickname,
      })
      router.push("/onboarding")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* 닉네임 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-nickname" className="text-foreground">{"닉네임"}</Label>
        <Input
          id="signup-nickname"
          type="text"
          placeholder="사용할 닉네임을 입력해 주세요"
          {...register("nickname")}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {errors.nickname && (
          <p className="text-sm text-destructive">{errors.nickname.message}</p>
        )}
      </div>

      {/* 이메일 인증 — EmailSection이 독립적으로 처리 */}
      <EmailSection onVerified={handleVerified} onEmailChange={handleEmailChange} />

      {/* 비밀번호 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password" className="text-foreground">{"비밀번호"}</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="8~20자, 영문·숫자·특수문자 포함"
          {...register("password")}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-confirm" className="text-foreground">{"비밀번호 확인"}</Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
          {...register("confirmPassword")}
          className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !verifiedEmail}
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
