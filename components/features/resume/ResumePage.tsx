"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MOCK_RESUME } from "@/lib/mock/resume";
import type { ResumeData, ResumeBasicInfo } from "@/types/resume";
import { ResumeUploadSection } from "./ResumeUploadSection";
import { ResumeSummarySection } from "./ResumeSummarySection";
import { ResumeQATab } from "./ResumeQATab";

const MOCK_PARSE_FAIL = false;

const TRIGGER_CLASS =
  "rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-semibold " +
  "text-muted-foreground transition-colors " +
  "data-[state=active]:border-primary data-[state=active]:text-foreground " +
  "data-[state=active]:bg-transparent data-[state=active]:shadow-none " +
  "hover:text-foreground";

export function ResumePage({ defaultTab = "resume" }: { defaultTab?: string }) {
  const [hasResume, setHasResume] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ResumeBasicInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    void file;
    setErrorMessage(null);
    setIsParsing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (MOCK_PARSE_FAIL) {
      setIsParsing(false);
      setErrorMessage(
        "이력서를 분석하지 못했습니다. 파일 형식을 확인하고 다시 시도해 주세요.",
      );
      return;
    }
    setResume(MOCK_RESUME);
    setHasResume(true);
    setIsParsing(false);
  };

  const handleReupload = () => {
    setHasResume(false);
    setResume(null);
  };

  const handleStartEdit = () => {
    if (!resume) return;
    setDraft({ ...resume.basicInfo });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!resume || !draft) return;
    setResume({ ...resume, basicInfo: draft });
    setIsEditing(false);
    setDraft(null);
  };

  const handleDraftChange = (
    field: keyof ResumeBasicInfo,
    value: string | number,
  ) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <Tabs defaultValue={defaultTab}>
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
