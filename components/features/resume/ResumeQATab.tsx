"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getSavedQAs, removeQA } from "@/lib/mock/resume-qa";
import type { SavedQA } from "@/lib/mock/resume-qa";
import { ResumeQAJobList } from "./ResumeQAJobList";
import { ResumeQADetail } from "./ResumeQADetail";

export function ResumeQATab() {
  const initial = getSavedQAs();
  const [savedQAs, setSavedQAs] = useState<SavedQA[]>(initial);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    initial[0]?.jobId ?? null,
  );

  const selectedQA = savedQAs.find((qa) => qa.jobId === selectedJobId) ?? null;

  const handleDelete = (jobId: string) => {
    removeQA(jobId);
    const updated = getSavedQAs();
    setSavedQAs(updated);
    if (selectedJobId === jobId) {
      setSelectedJobId(updated[0]?.jobId ?? null);
    }
    toast.success("면접 Q&A가 삭제되었습니다.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ResumeQAJobList
        items={savedQAs}
        selectedJobId={selectedJobId}
        onSelect={setSelectedJobId}
      />
      <ResumeQADetail qa={selectedQA} onDelete={handleDelete} />
    </div>
  );
}
