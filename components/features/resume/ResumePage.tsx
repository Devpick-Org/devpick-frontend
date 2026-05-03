"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ResumeData, ResumeBasicInfo } from "@/types/resume";
import { resumeEndpoints } from "@/lib/api/endpoints/resume";
import { extractApiError } from "@/lib/api/extractApiError";
import { authEndpoints } from "@/lib/api/endpoints/auth";
import { usersEndpoints } from "@/lib/api/endpoints/users";
import {
  cloneResumeData,
  emptyResumeData,
  masterJsonToResumeData,
  resumeDataToMasterJson,
} from "@/lib/resume/masterResumeJson";
import { mergeProfileIntoResume } from "@/lib/resume/profileResumeSync";
import { buildProfileUpdatesFromResumeBasicInfo } from "@/lib/resume/resumeBasicInfoProfileAlign";
import { dedupeCi, suggestedTechFromJobTitle } from "@/lib/resume/skillSuggestions";
import { dedupeTags } from "@/lib/utils";
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

async function patchLearningProfileAfterResumeBasicInfo(
  basicInfo: ResumeBasicInfo,
): Promise<boolean> {
  const { user: authUser, updateUser } = useAuthStore.getState();
  const patch = buildProfileUpdatesFromResumeBasicInfo(authUser, basicInfo);
  if (Object.keys(patch).length === 0) return false;

  await usersEndpoints.updateMe(patch);
  const { data: meData } = await authEndpoints.getMe();
  updateUser({
    nickname: meData.data.nickname,
    job: meData.data.job ?? undefined,
    level: meData.data.level ?? undefined,
    tags: dedupeTags(meData.data.tags?.length ? meData.data.tags : authUser?.tags),
    profileImage: meData.data.profileImage ?? authUser?.profileImage,
  });
  return true;
}

export function ResumePage({ defaultTab = "resume" }: { defaultTab?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab === "qa" ? "qa" : "resume");
  const [editDraft, setEditDraft] = useState<ResumeData | null>(null);

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
      editDraft?.basicInfo.jobTitle ?? resume?.basicInfo.jobTitle ?? "";
    const fromProfile = user?.tags ?? [];
    const fromJob = suggestedTechFromJobTitle(jobTitle);
    return dedupeCi([...fromProfile, ...fromJob]);
  }, [
    editDraft?.basicInfo.jobTitle,
    resume?.basicInfo.jobTitle,
    user?.tags,
  ]);

  const hasResume = resume != null;

  const saveMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      await resumeEndpoints.putMaster(resumeDataToMasterJson(data));
      const profileSynced = await patchLearningProfileAfterResumeBasicInfo(
        data.basicInfo,
      );
      return { profileSynced };
    },
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: ["master-resume"] });
      toast.success("이력서가 저장되었습니다.");
      if (result.profileSynced) {
        toast.message(
          "마이페이지 학습 정보(직무·경력 레벨)를 이력서 기준에 맞췄어요.",
          { duration: 5500 },
        );
      }
    },
    onError: (e) => {
      const { message } = extractApiError(e);
      toast.error(message ?? "저장에 실패했습니다.");
    },
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => resumeEndpoints.importMasterFromFile(file),
    onSuccess: async (json) => {
      setErrorMessage(null);
      qc.setQueryData(["master-resume"], json);
      void qc.invalidateQueries({ queryKey: ["master-resume"] });
      const data = masterJsonToResumeData(json);
      const synced = await patchLearningProfileAfterResumeBasicInfo(data.basicInfo);
      toast.success("업로드한 이력서를 분석해 저장했습니다.");
      if (synced) {
        toast.message(
          "마이페이지 학습 정보(직무·경력 레벨)를 이력서 기준에 맞췄어요.",
          { duration: 5500 },
        );
      }
      toast.message(
        "내용은 요약 페이지에서 수정한 뒤, 채용 상세에서 면접 Q&A를 만들 수 있어요.",
        { duration: 6200 },
      );
    },
    onError: (e) => {
      const { message, code } = extractApiError(e);
      let msg =
        message ?? "파일 분석 또는 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      if (
        code === "FILE_002" ||
        code === "GLOBAL_415" ||
        /\b형식\b/i.exec(msg ?? "") !== null
      ) {
        msg = "현재 지원 형식은 PDF와 DOCX뿐이에요. 다른 형식이면 저장 후 다시 올려 주세요.";
      } else if (code === "FILE_003" || code === "PAYLOAD_TOO_LARGE") {
        msg = "파일이 너무 큽니다 (최대 10MB).";
      } else if (code === "RESUME_003") {
        msg =
          message ??
          "이 파일에서 글자를 거의 찾지 못했습니다. 검색 가능한 PDF/DOCX인지 확인해 주세요.";
      }
      setErrorMessage(msg);
      toast.error(msg);
    },
  });

  const startManual = useCallback(() => {
    const initial = mergeProfileIntoResume(emptyResumeData(), user);
    saveMutation.mutate(initial, {
      onSuccess: () => {
        setEditDraft(cloneResumeData(initial));
      },
    });
  }, [saveMutation, user]);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const name = file.name.toLowerCase();
    const okExt = name.endsWith(".pdf") || name.endsWith(".docx");
    if (!okExt) {
      const msg =
        "현재는 PDF 또는 DOCX만 분석할 수 있어요. HWP 등은 다른 형식으로 변환해서 올려 주세요.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const msg = "파일이 너무 큽니다 (최대 10MB).";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    importMutation.mutate(file);
  };

  const handleStartEdit = () => {
    if (!resume) return;
    setEditDraft(cloneResumeData(resume));
  };

  const handleCancelEdit = () => {
    setEditDraft(null);
  };

  const handleSaveEdit = () => {
    if (!editDraft) return;
    saveMutation.mutate(editDraft, {
      onSuccess: () => {
        setEditDraft(null);
      },
    });
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
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value);
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
        {!hasResume || importMutation.isPending ? (
          <ResumeUploadSection
            isParsing={importMutation.isPending}
            onFileSelect={handleFileSelect}
            errorMessage={errorMessage}
            onStartManual={startManual}
          />
        ) : (
          resume && (
            <ResumeSummarySection
              resume={resume}
              onReuploadFile={handleFileSelect}
              editDraft={editDraft}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onEditDraftChange={setEditDraft}
              isSaving={saveMutation.isPending}
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
