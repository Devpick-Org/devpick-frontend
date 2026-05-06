"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Tags, X, ClipboardList, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JobCategory, ExperienceLevel } from "@/types/jobs";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  LOCATION_FILTER_OPTIONS,
} from "./jobs.constants";
import { DEFAULT_JOB_FILTERS, type JobFilters } from "./JobFilterBar";
import { JobTechCompanyPicker } from "./JobTechCompanyPicker";

type MainTab = "conditions" | "tech" | "company";

interface JobUnifiedFilterModalProps {
  open: boolean;
  /** 열 때마다 증가 — 모달 내부 draft를 최신 `filters`로 다시 초기화 */
  remountSignal: number;
  onOpenChange: (open: boolean) => void;
  filters: JobFilters;
  onApply: (next: JobFilters) => void;
}

const noopSubscribe = () => () => {};

function useBrowserMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function ConditionPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold transition-colors leading-none cursor-pointer",
              on
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ModalInner({
  onOpenChange,
  filtersProp,
  onApply,
}: {
  onOpenChange: (open: boolean) => void;
  filtersProp: JobFilters;
  onApply: (next: JobFilters) => void;
}) {
  const titleId = useId();

  function cloneDraft(f: JobFilters): JobFilters {
    return {
      category: f.category,
      experienceLevel: f.experienceLevel,
      location: f.location,
      techStack: [...f.techStack],
      companyNames: [...f.companyNames],
    };
  }

  const [draft, setDraft] = useState<JobFilters>(() => cloneDraft(filtersProp));
  const [mainTab, setMainTab] = useState<MainTab>("conditions");

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onOpenChange]);

  const locationRadioOptions: { value: JobFilters["location"]; label: string }[] =
    [
      { value: "ALL", label: "전체" },
      ...LOCATION_FILTER_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ];

  return (
    <div
      className="fixed inset-0 isolate z-[110] animate-in fade-in-0 duration-200"
      aria-hidden={false}
    >
      <button
        type="button"
        className="absolute inset-0 z-40 cursor-default bg-black/50 outline-none ring-0 backdrop-blur-[2px]"
        aria-label="모달 닫기"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-32px)] max-w-[760px]",
          "-translate-x-1/2 -translate-y-1/2",
          "max-h-[min(820px,calc(100vh-24px))] flex-col overflow-hidden rounded-3xl border border-border bg-popover text-popover-foreground shadow-xl",
          "animate-in fade-in-0 zoom-in-[0.985] duration-200",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 bg-popover px-4 pb-4 pt-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
              >
                채용 필터
              </h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                조건과 태그를 한 곳에서 맞추고 적용하면 목록에 반영됩니다.
              </p>
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => onOpenChange(false)}
              className="shrink-0 cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex border-b border-border">
            {[
              { id: "conditions" as const, label: "직무 · 경력 · 근무지" },
              { id: "tech" as const, label: "태그" },
              { id: "company" as const, label: "회사" },
            ].map((tab) => {
              const on = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMainTab(tab.id)}
                  className={cn(
                    "flex-1 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer",
                    on
                      ? "border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-popover">
          {mainTab === "conditions" ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6">
              <div className="space-y-8">
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    직무
                  </h3>
                  <ConditionPills
                    options={JOB_CATEGORY_OPTIONS}
                    value={draft.category}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, category: v as JobCategory | "ALL" }))
                    }
                  />
                </section>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    경력
                  </h3>
                  <ConditionPills
                    options={EXPERIENCE_LEVEL_OPTIONS}
                    value={draft.experienceLevel}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, experienceLevel: v as ExperienceLevel | "ALL" }))
                    }
                  />
                </section>
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    근무지
                  </h3>
                  <ConditionPills
                    options={locationRadioOptions}
                    value={draft.location}
                    onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
                  />
                </section>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <JobTechCompanyPicker
                key={mainTab}
                initialTab={mainTab}
                hideTabSwitcher
                techStack={draft.techStack}
                companyNames={draft.companyNames}
                onTechStackChange={(techStack) => setDraft((d) => ({ ...d, techStack }))}
                onCompanyNamesChange={(companyNames) => setDraft((d) => ({ ...d, companyNames }))}
              />
            </div>
          )}
        </div>

        <footer className="shrink-0 space-y-2 bg-popover px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 font-semibold hover:bg-muted hover:text-foreground"
              onClick={() => setDraft(cloneDraft(DEFAULT_JOB_FILTERS))}
            >
              초기화
            </Button>
            <Button
              type="button"
              className="h-11 font-semibold shadow-md"
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
            >
              검색 적용
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function JobUnifiedFilterModal({
  open,
  remountSignal,
  onOpenChange,
  filters,
  onApply,
}: JobUnifiedFilterModalProps) {
  const browserMounted = useBrowserMounted();

  const mountKey = [
    filters.category,
    filters.experienceLevel,
    filters.location,
    [...filters.techStack].sort().join("\u0001"),
    [...filters.companyNames].sort().join("\u0001"),
  ].join("\u0002");

  if (!open || !browserMounted) return null;

  return createPortal(
    <ModalInner
      key={`${mountKey}-${remountSignal}`}
      onOpenChange={onOpenChange}
      filtersProp={filters}
      onApply={onApply}
    />,
    document.body,
  );
}
