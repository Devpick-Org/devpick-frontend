"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { EcoTrendCard } from "./EcoTrendCard";
import type { EcosystemTrendItemDto } from "@/types/trends";

type EcoTrendExpandOverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  items: EcosystemTrendItemDto[];
};

export function EcoTrendExpandOverlay({
  open,
  onClose,
  title,
  items,
}: EcoTrendExpandOverlayProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4 animate-in fade-in-0 duration-200"
      onClick={onClose}
      aria-hidden
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(80vh,720px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <h2 id={titleId} className="text-lg font-bold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              항목이 없습니다.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <EcoTrendCard
                  key={`${item.id}-${item.thumbnailUrl ?? ""}`}
                  item={item}
                  className="w-full max-w-none hover:shadow-sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
