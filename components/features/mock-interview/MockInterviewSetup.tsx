"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Check, ChevronDown, Loader2, Search } from "lucide-react";
import {
  mockInterviewsEndpoints,
  type MockInterviewMode,
} from "@/lib/api/endpoints/mock-interviews";
import { jobsEndpoints, type JobListItemApi } from "@/lib/api/endpoints/jobs";
import { cn } from "@/lib/utils";
import {
  MockInterviewLoadingStepList,
  PLAN_START_LOADING_STEPS,
} from "./MockInterviewLoadingStepList";

interface MockInterviewSetupValues {
  modelKey: string;
  mode: MockInterviewMode;
  /** 크롤링 공고 기반 시작 */
  jobId?: string;
  companyName?: string;
  jobTitle?: string;
  jobCategory?: string;
  rawJdText?: string;
}

interface MockInterviewSetupProps {
  variant: "JOB" | "JD";
  initialJobTitle?: string;
  initialCompanyName?: string;
  initialJobCategory?: string;
  submitting: boolean;
  hasResume: boolean;
  onSubmit: (values: MockInterviewSetupValues) => void;
}

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "FRONTEND", label: "프론트엔드" },
  { value: "BACKEND", label: "백엔드" },
  { value: "FULLSTACK", label: "풀스택" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "AI_ML", label: "AI/ML" },
  { value: "MOBILE", label: "모바일" },
  { value: "DATA", label: "데이터" },
];

export function MockInterviewSetup({
  variant,
  initialJobTitle = "",
  initialCompanyName = "",
  initialJobCategory = "FRONTEND",
  submitting,
  hasResume,
  onSubmit,
}: MockInterviewSetupProps) {
  const { data: modelsData, isLoading: isLoadingModels } = useQuery({
    queryKey: ["mock-interview-models"],
    queryFn: mockInterviewsEndpoints.models,
    staleTime: 5 * 60 * 1000,
  });

  const [modelKey, setModelKey] = useState<string>("");
  const [mode] = useState<MockInterviewMode>("FULL");
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [jobCategory, setJobCategory] = useState(initialJobCategory);
  const [rawJdText, setRawJdText] = useState("");
  const [jobSearchInput, setJobSearchInput] = useState("");
  const [debouncedJobSearch, setDebouncedJobSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobListItemApi | null>(null);
  const [manualJd, setManualJd] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const jobCardsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedJobSearch(jobSearchInput),
      350,
    );
    return () => window.clearTimeout(t);
  }, [jobSearchInput]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: jobSearchPage, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["mock-interview-setup-job-search", debouncedJobSearch],
    queryFn: () =>
      jobsEndpoints.list({
        page: 0,
        size: 30,
        query: debouncedJobSearch.trim()
          ? debouncedJobSearch.trim()
          : undefined,
        sortBy: "MATCH",
      }),
    staleTime: 20_000,
  });

  useEffect(() => {
    if (manualJd) return;
    const el = jobCardsScrollRef.current;
    if (!el || !jobSearchPage?.jobs?.length) return;

    const epsilon = 2;
    const CARD_WIDTH = 284; // card width (260~272px) + gap (12px)
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + epsilon) return;
      const useX = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = useX ? e.deltaX : e.deltaY;
      if (delta === 0) return;

      const maxLeft = el.scrollWidth - el.clientWidth;
      const goingRight = delta > 0;
      const goingLeft = delta < 0;
      const atEnd = el.scrollLeft >= maxLeft - epsilon;
      const atStart = el.scrollLeft <= epsilon;

      if ((goingRight && atEnd) || (goingLeft && atStart)) return;

      e.preventDefault();
      el.scrollBy({
        left: goingRight ? CARD_WIDTH : -CARD_WIDTH,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [manualJd, jobSearchPage?.jobs?.length]);

  useEffect(() => {
    if (!modelsData) return;
    const id = window.setTimeout(() => {
      setModelKey((prev) => prev || modelsData.defaultKey);
    }, 0);
    return () => window.clearTimeout(id);
  }, [modelsData]);

  const canSubmit =
    hasResume &&
    !submitting &&
    !!modelKey &&
    (variant === "JOB" ||
      !!selectedJob?.id ||
      (manualJd && jobTitle.trim().length > 0));

  return (
    <>
      {submitting ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-busy="true"
          aria-live="polite"
          className="fixed inset-0 z-[99] flex items-center justify-center bg-background/80 p-6 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
        >
          <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl ring-1 ring-black/[0.05] dark:ring-white/[0.08] sm:p-8">
            <p className="text-center text-lg font-bold text-foreground">
              모의면접을 시작하는 중
            </p>
            <p className="mt-2 text-center text-[13px] text-muted-foreground">
              고정 플랜(15문항)을 순서대로 준비해요. 실제 서버 응답이 오면 다음
              화면으로 넘어갑니다.
            </p>

            <MockInterviewLoadingStepList
              steps={PLAN_START_LOADING_STEPS}
              running={submitting}
              intervalMs={2400}
            />
          </div>
        </div>
      ) : null}
      <form
        className={cn(
          "relative flex flex-col gap-5",
          submitting && "pointer-events-none",
        )}
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          if (selectedJob?.id) {
            onSubmit({
              modelKey,
              mode,
              jobId: selectedJob.id,
            });
            return;
          }
          onSubmit({
            modelKey,
            mode,
            companyName: companyName.trim(),
            jobTitle: jobTitle.trim(),
            jobCategory,
            rawJdText: rawJdText.trim(),
          });
        }}
      >
        {!hasResume && (
          <p className="rounded-lg bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
            모의면접을 시작하려면 먼저 마스터 이력서를 작성해 주세요.
          </p>
        )}

        {variant === "JD" && (
          <div className="flex flex-col gap-5">
            {!manualJd ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">
                  크롤링된 채용 공고 선택
                </p>
                <p className="-mt-2 text-sm leading-relaxed text-muted-foreground">
                  DB에 수집된 공고 중에서 고르면 JD가 자동으로 반영돼요.
                  회사명·직무명으로 검색해 보세요.
                </p>
                <label className="relative flex items-center gap-2">
                  <Search
                    className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={jobSearchInput}
                    onChange={(e) => setJobSearchInput(e.target.value)}
                    placeholder="예: 카카오, 백엔드, React…"
                    autoComplete="off"
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none"
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  휠을 아래로 내리면 카드 줄이 오른쪽으로 넘어가요.
                  끝·시작에서는 페이지 스크롤이 이어져요 (가로 스크롤·드래그도
                  가능해요).
                </p>
                {isLoadingJobs ? (
                  <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden />{" "}
                    공고를 불러오는 중…
                  </div>
                ) : !jobSearchPage?.jobs?.length ? (
                  <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                    검색 결과가 없어요.
                  </div>
                ) : (
                  <div
                    ref={jobCardsScrollRef}
                    className="-mx-1 flex gap-3 overflow-x-auto overflow-y-hidden pb-3 pt-1 [scrollbar-width:thin] snap-x snap-mandatory px-1 scroll-pl-1"
                    role="listbox"
                    aria-label="채용 공고 검색 결과"
                  >
                    {jobSearchPage.jobs.map((job) => {
                      const active = selectedJob?.id === job.id;
                      const techPreview = (job.techStack ?? []).slice(0, 4);
                      const techExtra = Math.max(
                        0,
                        (job.techStack?.length ?? 0) - techPreview.length,
                      );
                      const metaParts = [
                        [job.employmentType, job.experienceLevel]
                          .filter(Boolean)
                          .join(" · "),
                        [job.location, job.jobCategory]
                          .filter(Boolean)
                          .join(" · "),
                      ].filter((s) => s.length > 0);
                      return (
                        <button
                          key={job.id}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setSelectedJob(job);
                            setCompanyName(job.companyName);
                            setJobTitle(job.title);
                            setJobCategory(
                              job.jobCategory?.trim()
                                ? job.jobCategory
                                : "FRONTEND",
                            );
                          }}
                          className={cn(
                            "flex min-h-[260px] w-[260px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-2xl border bg-card text-left outline-none transition-transform active:scale-[0.99] sm:w-[272px]",
                            active ? "border-border" : "border-border",
                          )}
                        >
                          <div className="relative flex h-[88px] w-full shrink-0 items-center justify-center bg-muted/60">
                            {job.companyLogo ? (
                              // 외부 로고 URL — next/image 원격 패턴 목록 의존 없이 카드 헤더에 표시
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={job.companyLogo}
                                alt=""
                                className="mx-auto max-h-[72px] max-w-[90%] object-contain"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/[0.12] via-muted/40 to-primary/[0.08]">
                                <span className="flex size-14 items-center justify-center rounded-2xl bg-background/85 text-xl font-bold text-primary shadow-inner">
                                  {job.companyName?.trim()?.charAt(0) ? (
                                    job.companyName.trim().charAt(0)
                                  ) : (
                                    <Building2
                                      className="size-7 text-muted-foreground"
                                      aria-hidden
                                    />
                                  )}
                                </span>
                              </div>
                            )}
                            {active ? (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </span>
                            ) : null}
                          </div>
                          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3.5 pt-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">
                              {job.companyName}
                            </p>
                            <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground">
                              {job.title}
                            </p>
                            {metaParts.length > 0 ? (
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                {metaParts.join(" | ")}
                              </p>
                            ) : null}
                            {techPreview.length > 0 ? (
                              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                                {techPreview.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {techExtra > 0 ? (
                                  <span className="rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    +{techExtra}
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <button
                  type="button"
                  className="w-fit cursor-pointer text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    setManualJd(true);
                    setSelectedJob(null);
                  }}
                >
                  공고가 없으면 직접 입력하기
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <button
                  type="button"
                  className="w-fit cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setManualJd(false);
                    setCompanyName(initialCompanyName);
                    setJobTitle(initialJobTitle);
                    setRawJdText("");
                  }}
                >
                  ← 공고 목록에서 다시 선택
                </button>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                    회사명 (선택)
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="예: 네이버"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                    직무명
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="예: Frontend Engineer"
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                    직무 카테고리
                    <div ref={categoryDropdownRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen((v) => !v)}
                        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg bg-white border border-border px-3 text-sm font-medium text-foreground outline-none transition-colors"
                      >
                        <span>
                          {CATEGORY_OPTIONS.find((o) => o.value === jobCategory)
                            ?.label ?? "선택"}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isCategoryOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isCategoryOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card">
                          {CATEGORY_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setJobCategory(opt.value);
                                setIsCategoryOpen(false);
                              }}
                              className={cn(
                                "flex w-full cursor-pointer items-center px-3 py-2.5 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg",
                                jobCategory === opt.value
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground hover:bg-secondary",
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="col-span-full flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                    JD 본문 (선택, 회사 맥락 강화)
                    <textarea
                      value={rawJdText}
                      onChange={(e) => setRawJdText(e.target.value)}
                      placeholder="회사 채용 본문을 그대로 붙여 넣으면 질문이 더 맞춤형으로 나와요."
                      rows={6}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed outline-none"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            평가 모델
          </p>
          {isLoadingModels ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> 모델 정보를 불러오는
              중…
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modelsData?.models.map((opt) => {
                const active = modelKey === opt.key;
                return (
                  <li key={opt.key}>
                    <button
                      type="button"
                      onClick={() => setModelKey(opt.key)}
                      className={cn(
                        "flex w-full cursor-pointer flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                        active
                          ? "border-border bg-primary/5"
                          : "border-border bg-card hover:bg-muted/40",
                      )}
                    >
                      <span className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-foreground">
                        {opt.label}
                        {opt.experimental && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                            실험적
                          </span>
                        )}
                      </span>
                      <span className="text-xs leading-relaxed text-muted-foreground">
                        {opt.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="ml-auto inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          모의면접 시작하기
        </button>
      </form>
    </>
  );
}
