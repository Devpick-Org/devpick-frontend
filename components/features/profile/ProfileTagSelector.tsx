"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SUGGESTED_TAGS } from "./constants";

interface ProfileTagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ProfileTagSelector({ value, onChange }: ProfileTagSelectorProps) {
  const [tagSearch, setTagSearch] = useState("");

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return SUGGESTED_TAGS;
    return SUGGESTED_TAGS.filter((tag) =>
      tag.toLowerCase().includes(tagSearch.toLowerCase()),
    );
  }, [tagSearch]);

  const toggleTag = (tag: string) => {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div>
      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                aria-label={`${tag} 제거`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="기술 태그 검색..."
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          className="h-10 bg-secondary border-border pl-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
        />
      </div>

      {/* Tag Grid */}
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => {
          const isSelected = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/10"
                  : "border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {tag}
            </button>
          );
        })}
        {filteredTags.length === 0 && (
          <p className="w-full py-4 text-center text-sm text-muted-foreground">
            {`검색 결과가 없습니다. "${tagSearch}"`}
          </p>
        )}
      </div>
    </div>
  );
}
