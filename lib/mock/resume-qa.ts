import type { QACategory } from "@/types/jobs";

export interface SavedQA {
  jobId: string;
  companyName: string;
  jobTitle: string;
  matchScore: number;
  qaCategories: QACategory[];
  savedAt: string;
}

const savedQAs: SavedQA[] = [];

export function saveQA(entry: Omit<SavedQA, "savedAt">): void {
  const idx = savedQAs.findIndex((qa) => qa.jobId === entry.jobId);
  const record = { ...entry, savedAt: new Date().toISOString() };
  if (idx !== -1) {
    savedQAs[idx] = record;
  } else {
    savedQAs.push(record);
  }
}

export function isQASaved(jobId: string): boolean {
  return savedQAs.some((qa) => qa.jobId === jobId);
}

export function removeQA(jobId: string): void {
  const idx = savedQAs.findIndex((qa) => qa.jobId === jobId);
  if (idx !== -1) savedQAs.splice(idx, 1);
}

export function getSavedQAs(): SavedQA[] {
  return [...savedQAs];
}
