"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import {
  mockInterviewsEndpoints,
  type MockInterviewMode,
} from "@/lib/api/endpoints/mock-interviews";
import { jobsEndpoints, type JobListItemApi } from "@/lib/api/endpoints/jobs";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedJobSearch(jobSearchInput), 350);
    return () => window.clearTimeout(t);
  }, [jobSearchInput]);

  const { data: jobSearchPage, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["mock-interview-setup-job-search", debouncedJobSearch],
    queryFn: () =>
      jobsEndpoints.list({
        page: 0,
        size: 30,
        query: debouncedJobSearch.trim() ? debouncedJobSearch.trim() : undefined,
        sortBy: "MATCH",
      }),
    staleTime: 20_000,
  });

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
    <form
      className="flex flex-col gap-5"
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
              <p className="text-xs font-semibold text-foreground">크롤링된 채용 공고 선택</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                DB에 수집된 공고 중에서 고르면 JD가 자동으로 반영돼요. 회사명·직무명으로 검색해 보세요.
              </p>
              <label className="relative flex items-center gap-2">
                <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
                <input
                  type="search"
                  value={jobSearchInput}
                  onChange={(e) => setJobSearchInput(e.target.value)}
                  placeholder="예: 카카오, 백엔드, React…"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </label>
              {isLoadingJobs ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden /> 공고를 불러오는 중…
                </div>
              ) : (
                <ul
                  className={cn(
                    "max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border bg-muted/15 p-1.5",
                    !jobSearchPage?.jobs?.length && "py-6 text-center text-sm text-muted-foreground",
                  )}
                  role="listbox"
                  aria-label="채용 공고 검색 결과"
                >
                  {jobSearchPage?.jobs?.length ? (
                    jobSearchPage.jobs.map((job) => {
                      const active = selectedJob?.id === job.id;
                      return (
                        <li key={job.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setSelectedJob(job);
                              setCompanyName(job.companyName);
                              setJobTitle(job.title);
                              setJobCategory(
                                job.jobCategory?.trim() ? job.jobCategory : "FRONTEND",
                              );
                            }}
                            className={cn(
                              "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                              active ? "bg-primary/12 ring-1 ring-primary/35" : "hover:bg-muted/60",
                            )}
                          >
                            <span className="font-semibold text-foreground">{job.companyName}</span>
                            <span className="line-clamp-2 text-xs text-muted-foreground">{job.title}</span>
                            <span className="text-[11px] text-muted-foreground/90">
                              {job.location ? `${job.location} · ` : ""}
                              {job.jobCategory}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-3">검색 결과가 없어요.</li>
                  )}
                </ul>
              )}
              {selectedJob ? (
                <p className="rounded-lg bg-primary/8 px-3 py-2 text-xs text-muted-foreground">
                  선택함:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedJob.companyName} · {selectedJob.title}
                  </span>
                </p>
              ) : null}
              <button
                type="button"
                className="w-fit text-xs font-semibold text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  setManualJd(true);
                  setSelectedJob(null);
                }}
              >
                공고가 없으면 직접 입력하기
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="w-fit text-xs font-semibold text-muted-foreground hover:text-foreground"
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
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                  직무명
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="예: Frontend Engineer"
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                  직무 카테고리
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="col-span-full flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                  JD 본문 (선택, 회사 맥락 강화)
                  <textarea
                    value={rawJdText}
                    onChange={(e) => setRawJdText(e.target.value)}
                    placeholder="회사 채용 본문을 그대로 붙여 넣으면 질문이 더 맞춤형으로 나와요."
                    rows={6}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">평가 모델</p>
        {isLoadingModels ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> 모델 정보를 불러오는 중…
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
                      "flex w-full flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/5"
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
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        모의면접 시작하기
      </button>
    </form>
  );
}
