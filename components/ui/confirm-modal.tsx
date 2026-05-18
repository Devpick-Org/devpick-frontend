"use client"

import { useEffect, useId } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  variant?: "default" | "danger"
  isLoading?: boolean
}

export function ConfirmModal({
  open,
  onClose,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  onConfirm,
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    // 오버레이 — overlay 클릭 시 닫힘
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0 duration-200"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* 카드 — 클릭 이벤트 버블링 차단 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-xs",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-lg bg-card p-6 shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-4 flex flex-col gap-2">
          <h2
            id={titleId}
            className="text-lg font-semibold leading-none text-foreground"
          >
            {title}
          </h2>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {/* 버튼 — 취소(좌) / 확인(우) */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="border-0 bg-secondary text-foreground hover:!bg-secondary hover:text-foreground"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                처리 중...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
