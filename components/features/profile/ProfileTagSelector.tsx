"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SUGGESTED_TAGS, TAG_GROUPS } from "./constants";

interface ProfileTagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

// --- 아이콘 컴포넌트 ---
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

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function ProfileTagSelector({
  value,
  onChange,
}: ProfileTagSelectorProps) {
  const [inputValue, setInputValue] = useState("");

  const [customTags, setCustomTags] = useState<string[]>(() => {
    return value.filter(
      (selectedTag) =>
        !SUGGESTED_TAGS.some(
          (suggestedTag) =>
            suggestedTag.toLowerCase() === selectedTag.toLowerCase(),
        ),
    );
  });

  // 태그 선택/해제 토글
  const toggleTag = (tag: string) => {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );
  };

  // 선택된 태그 삭제
  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  // 커스텀 태그 추가 로직
  const handleAddTag = () => {
    const newTag = inputValue.trim();
    if (!newTag) return;

    const lowerNewTag = newTag.toLowerCase();

    // 1. 이미 선택되었는지 확인
    if (value.some((t) => t.toLowerCase() === lowerNewTag)) {
      alert("이미 추가된 태그입니다.");
      setInputValue("");
      return;
    }

    // 2. 전체 목록(기본+커스텀)에 이미 있는지 확인
    const allTags = [...SUGGESTED_TAGS, ...customTags];
    const existingTag = allTags.find((t) => t.toLowerCase() === lowerNewTag);

    if (existingTag) {
      onChange([...value, existingTag]);
    } else {
      setCustomTags((prev) => [...prev, newTag]);
      onChange([...value, newTag]);
    }

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // --- 검색어에 따른 카테고리 필터링 로직 ---
  const searchKeyword = inputValue.trim().toLowerCase();

  // 검색어에 맞는 커스텀 태그 필터링
  const filteredCustomTags = customTags.filter((tag) =>
    tag.toLowerCase().includes(searchKeyword),
  );

  // 검색어에 맞는 기본 태그 그룹 필터링 (일치하는 태그가 없으면 그룹 자체를 숨김)
  const filteredGroups = TAG_GROUPS.map((group) => ({
    label: group.label,
    tags: group.tags.filter((tag) => tag.toLowerCase().includes(searchKeyword)),
  })).filter((group) => group.tags.length > 0);

  return (
    <div className="flex flex-col">
      {/* 1. 맨 위: 이미 선택된 태그들 */}
      {/* ⭐️ 변경 포인트: min-h를 제거하여 태그가 없을 때는 아예 공간을 차지하지 않습니다. */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-1 hover:bg-primary/20 transition-colors"
                aria-label={`${tag} 제거`}
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 2. 중간: 검색 및 추가 창 */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="기술 태그 검색 또는 직접 입력 후 추가..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 bg-secondary pl-9 text-foreground font-medium placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={handleAddTag}
          disabled={!inputValue.trim()}
          className="flex h-10 items-center justify-center gap-1 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-4 w-4" />
          추가
        </button>
      </div>

      {/* 3. 아래: 카테고리별 태그 목록 (스크롤 적용) */}
      <div className="max-h-[260px] overflow-y-auto pr-2 pb-2 space-y-6">
        {/* 사용자가 직접 추가한 태그가 있다면 최상단에 보여줌 */}
        {filteredCustomTags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              내 커스텀 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {filteredCustomTags.map((tag) => {
                const isSelected = value.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 기본 제공 태그를 그룹별로 렌더링 */}
        {filteredGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => {
                const isSelected = value.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 검색 결과가 아예 없을 때 안내 문구 */}
        {filteredCustomTags.length === 0 && filteredGroups.length === 0 && (
          <div className="w-full py-6 text-center text-sm text-muted-foreground font-medium flex flex-col items-center gap-2">
            <span>&quot;{inputValue}&quot; 검색 결과가 없습니다.</span>
            <span className="text-primary font-medium">
              우측 추가 버튼을 눌러 새 태그를 만들어 보세요!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
