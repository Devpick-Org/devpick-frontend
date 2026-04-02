"use client"

import Link from "next/link"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 로그인이 필요한 이유를 설명하는 메시지 */
  message?: string
}

/**
 * 로그인이 필요한 액션을 시도할 때 보여주는 유도 다이얼로그.
 *
 * 사용 예) 좋아요/스크랩/질문하기 버튼 클릭 시
 * ```tsx
 * const [open, setOpen] = useState(false)
 * if (!isAuthenticated) { setOpen(true); return }
 * // ...실제 동작
 * <LoginPromptDialog open={open} onOpenChange={setOpen} message="좋아요를 누르려면" />
 * ```
 */
export function LoginPromptDialog({
  open,
  onOpenChange,
  message = "이 기능을 사용하려면",
}: LoginPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader className="items-center text-center sm:text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>로그인이 필요합니다</DialogTitle>
          <DialogDescription>
            {message} 로그인이 필요합니다.
            <br />
            Trace 계정으로 계속하세요.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/auth">로그인 / 회원가입</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            나중에
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
