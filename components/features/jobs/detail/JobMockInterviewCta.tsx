"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/extractApiError";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { mockInterviewsEndpoints } from "@/lib/api/endpoints/mock-interviews";
import { JobDetailSection } from "./JobDetailSection";

interface JobMockInterviewCtaProps {
  jobId: string;
}

export function JobMockInterviewCta({ jobId }: JobMockInterviewCtaProps) {
  const router = useRouter();

  const { data: hasResume } = useQuery({
    queryKey: ["master-resume"],
    queryFn: resumeEndpoints.getMasterOrNull,
    select: (d) => d != null,
    staleTime: 60_000,
  });

  const startMutation = useMutation({
    mutationFn: () =>
      mockInterviewsEndpoints.startFromJob(jobId, {
        modelKey: "balanced",
        mode: "FULL",
      }),
    onSuccess: (session) => {
      router.push(`/my-resume?tab=mock&session=${session.id}`);
      toast.success("모의면접을 시작했어요. 자기소개부터 진행해 보세요.");
    },
    onError: (e) => {
      const { message, code } = extractApiError(e);
      if (code === "RESUME_001") {
        toast.error("먼저 마스터 이력서를 작성해 주세요.");
        return;
      }
      toast.error(message ?? "모의면접 시작에 실패했습니다.");
    },
  });

  return (
    <JobDetailSection title="AI 모의면접" titleClassName="text-lg">
      <div className="flex flex-col gap-3 rounded-lg bg-muted/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <MessageSquare className="h-4 w-4" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">
              이 공고로 채팅형 모의면접 시작하기
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              15문항 5페이즈 구조로 자기소개·프로젝트·CS/인프라까지 흐름대로 답변하고, 영역별
              점수와 모범 답안까지 받아보세요. 평가 모델은 시작 후에도 다음 모의면접에서 변경할 수
              있어요.
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={!hasResume || startMutation.isPending}
          onClick={() => startMutation.mutate()}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {startMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {hasResume ? "모의면접 시작" : "이력서가 필요해요"}
        </button>
      </div>
    </JobDetailSection>
  );
}
