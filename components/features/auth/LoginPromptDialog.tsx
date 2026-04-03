"use client"

import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface LoginPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 로그인이 필요한 이유를 설명하는 메시지 */
  message?: string
}

export function LoginPromptDialog({
  open,
  onOpenChange,
  message = "이 기능을 사용하려면",
}: LoginPromptDialogProps) {
  const router = useRouter()

  return (
    <ConfirmModal
      open={open}
      onClose={() => onOpenChange(false)}
      title="로그인이 필요합니다"
      description={
        <>
          {message} 로그인이 필요합니다.
          <br />
          Trace 계정으로 계속하세요.
        </>
      }
      cancelText="취소"
      confirmText="로그인 / 회원가입"
      onConfirm={() => router.push("/auth")}
    />
  )
}
