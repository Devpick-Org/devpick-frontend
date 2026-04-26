"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { jobsEndpoints } from "@/lib/api/endpoints/jobs";
import { extractApiError } from "@/lib/api/extractApiError";
import { JobDetailSection } from "./JobDetailSection";

interface JobSkillGapSectionProps {
  jobId: string;
}

export function JobSkillGapSection({ jobId }: JobSkillGapSectionProps) {
  const [roadmap, setRoadmap] = useState<string[] | null>(null);
  const [contents, setContents] = useState<
    { id: string; title: string; preview: string; canonicalUrl: string; tags: string[] }[]
  >([]);
  const mutation = useMutation({
    mutationFn: () => jobsEndpoints.skillGap(jobId),
    onSuccess: (data) => {
      setRoadmap(data.roadmap ?? []);
      setContents(data.contents ?? []);
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "부족 역량 추천을 불러오지 못했습니다.");
    },
  });

  const hasResult =
    (roadmap && roadmap.length > 0) || contents.length > 0;

  return (
    <JobDetailSection
      title="부족 역량 보완"
      titleClassName="text-lg"
      action={
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          추천 받기
        </button>
      }
    >
      {!hasResult && !mutation.isPending && (
        <p className="text-sm font-medium text-muted-foreground">
          필수 기술 대비 부족한 부분을 기준으로 학습 로드맵과 추천 콘텐츠를 받을 수 있어요.
        </p>
      )}

      {mutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          추천을 생성하고 있어요…
        </div>
      )}

      {hasResult && (
        <div className="flex flex-col gap-6">
          {roadmap && roadmap.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-bold text-foreground">학습 로드맵</h4>
              <ol className="list-decimal space-y-1.5 pl-5 text-sm font-medium text-foreground">
                {roadmap.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {contents.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-bold text-foreground">추천 콘텐츠</h4>
              <ul className="space-y-2">
                {contents.map((c) => (
                  <li key={c.id}>
                    <a
                      href={c.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
                    >
                      {c.title}
                    </a>
                    {c.preview ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.preview}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </JobDetailSection>
  );
}
