"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ResumeData, ResumeBasicInfo } from "@/types/resume";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { extractApiError } from "@/lib/api/extractApiError";
import {
  cloneResumeData,
  emptyResumeData,
  masterJsonToResumeData,
  resumeDataToMasterJson,
} from "@/lib/resume/masterResumeJson";
import { mergeProfileIntoResume } from "@/lib/resume/profileResumeSync";
import { dedupeCi, suggestedTechFromJobTitle } from "@/lib/resume/skillSuggestions";
import { useAuthStore } from "@/store/auth.store";
import { ResumeUploadSection } from "./ResumeUploadSection";
import { ResumeSummarySection } from "./ResumeSummarySection";
import { ResumeQATab } from "./ResumeQATab";

const TRIGGER_CLASS =
  "rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-semibold " +
  "text-muted-foreground transition-colors " +
  "data-[state=active]:border-primary data-[state=active]:text-foreground " +
  "data-[state=active]:bg-transparent data-[state=active]:shadow-none " +
  "hover:text-foreground";

export function ResumePage({ defaultTab = "resume" }: { defaultTab?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ResumeBasicInfo | null>(null);
  const [detailDraft, setDetailDraft] = useState<ResumeData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: masterJson,
    isLoading: isResumeLoading,
    isError: isResumeError,
    refetch: refetchResume,
  } = useQuery({
    queryKey: ["master-resume"],
    queryFn: resumeEndpoints.getMasterOrNull,
  });

  const resume: ResumeData | null = useMemo(
    () => (masterJson ? masterJsonToResumeData(masterJson) : null),
    [masterJson],
  );

  const suggestedTechPool = useMemo(() => {
    const jobTitle =
      detailDraft?.basicInfo.jobTitle ?? resume?.basicInfo.jobTitle ?? "";
    const fromProfile = user?.tags ?? [];
    const fromJob = suggestedTechFromJobTitle(jobTitle);
    return dedupeCi([...fromProfile, ...fromJob]);
  }, [
    detailDraft?.basicInfo.jobTitle,
    resume?.basicInfo.jobTitle,
    user?.tags,
  ]);

  const hasResume = resume != null;

  const saveMutation = useMutation({
    mutationFn: (data: ResumeData) =>
      resumeEndpoints.putMaster(resumeDataToMasterJson(data)),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["master-resume"] });
      toast.success("이력서가 저장되었습니다.");
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "저장에 실패했습니다.");
    },
  });

  const handleFileSelect = async (file: File) => {
    void file;
    setErrorMessage(null);
    setIsParsing(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsParsing(false);
    setErrorMessage(
      "현재 버전에서는 파일 자동 파싱을 지원하지 않습니다. 아래 「직접 작성하기」로 정보를 입력해 주세요.",
    );
  };

  const startManual = useCallback(() => {
    const initial = mergeProfileIntoResume(emptyResumeData(), user);
    saveMutation.mutate(initial, {
      onSuccess: () => {
        setIsEditing(true);
        setDraft({ ...initial.basicInfo });
      },
    });
  }, [saveMutation, user]);

  const handleReupload = () => {
    toast.message("이력서를 삭제하려면 내용을 비운 뒤 저장하거나 관리자에게 문의하세요.");
  };

  const handleStartEdit = () => {
    if (!resume) return;
    setDetailDraft(null);
    setDraft({ ...resume.basicInfo });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const handleStartDetailEdit = () => {
    if (!resume) return;
    setIsEditing(false);
    setDraft(null);
    setDetailDraft(cloneResumeData(resume));
  };

  const handleCancelDetailEdit = () => {
    setDetailDraft(null);
  };

  const handleSaveDetail = () => {
    if (!detailDraft) return;
    saveMutation.mutate(detailDraft, {
      onSuccess: () => {
        setDetailDraft(null);
      },
    });
  };

  const handleApplyProfile = () => {
    if (!resume) return;
    const next = mergeProfileIntoResume(resume, user);
    saveMutation.mutate(next);
  };

  const handleSave = () => {
    if (!resume || !draft) return;
    const next: ResumeData = { ...resume, basicInfo: draft };
    saveMutation.mutate(next, {
      onSuccess: () => {
        setIsEditing(false);
        setDraft(null);
      },
    });
  };

  const handleDraftChange = (
    field: keyof ResumeBasicInfo,
    value: string | number,
  ) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (isResumeLoading) {
    return (
      <div className="rounded-2xl border border-border bg-muted/20 py-20 text-center text-sm text-muted-foreground">
        불러오는 중…
      </div>
    );
  }

  if (isResumeError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 py-12 text-center">
        <p className="text-sm font-medium text-destructive">이력서를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => void refetchResume()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={defaultTab}
      onValueChange={(value) => {
        const url = value === "qa" ? "/my-resume?tab=qa" : "/my-resume";
        router.replace(url, { scroll: false });
      }}
    >
      <TabsList className="mb-6 h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger value="resume" className={TRIGGER_CLASS}>
          이력서
        </TabsTrigger>
        <TabsTrigger value="qa" className={TRIGGER_CLASS}>
          면접 Q&A
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resume">
        {!hasResume || isParsing ? (
          <ResumeUploadSection
            isParsing={isParsing}
            onFileSelect={handleFileSelect}
            errorMessage={errorMessage}
            onStartManual={startManual}
          />
        ) : (
          resume && (
            <ResumeSummarySection
              resume={resume}
              onReupload={handleReupload}
              isEditing={isEditing}
              draft={draft}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSave={handleSave}
              onDraftChange={handleDraftChange}
              isSaving={saveMutation.isPending}
              onApplyProfile={handleApplyProfile}
              showApplyProfile={Boolean(user)}
              detailDraft={detailDraft}
              onStartDetailEdit={handleStartDetailEdit}
              onCancelDetailEdit={handleCancelDetailEdit}
              onSaveDetail={handleSaveDetail}
              onDetailDraftChange={setDetailDraft}
              suggestedTechPool={suggestedTechPool}
            />
          )
        )}
      </TabsContent>

      <TabsContent value="qa">
        <ResumeQATab />
      </TabsContent>
    </Tabs>
  );
}
