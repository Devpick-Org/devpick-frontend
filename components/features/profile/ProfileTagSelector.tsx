"use client";

import { useState } from "react";
import { cn, dedupeTags } from "@/lib/utils";
import { TechTagPickerModal } from "./TechTagPickerModal";

interface ProfileTagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function XGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ProfileTagSelector({
  value,
  onChange,
}: ProfileTagSelectorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dedupeTags(value).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-1 hover:bg-primary/20 transition-colors cursor-pointer"
                aria-label={`${tag} 제거`}
              >
                <XGlyph className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-left text-sm font-medium transition-colors hover:border-primary/40 cursor-pointer text-foreground",
        )}
        onClick={() => setPickerOpen(true)}
      >
        <SearchGlyph className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-muted-foreground">
          기술 스택 검색… (모달에서 선택)
        </span>
      </button>

      <TechTagPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        value={value}
        onApply={onChange}
        title="관심 기술 태그 선택"
      />
    </div>
  );
}
