"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** 활성 동안 단계 인덱스를 일정 간격으로 올리다 마지막 단계에서 멈춤 */
export function useProgressStepTicker(
  active: boolean,
  totalSteps: number,
  intervalMs: number,
  resetKey: string,
): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active || totalSteps <= 1) {
      const tid = window.setTimeout(() => {
        setStep(0);
      }, 0);
      return () => window.clearTimeout(tid);
    }

    let cancelled = false;
    const cap = Math.max(0, totalSteps - 1);
    const kick = window.setTimeout(() => {
      if (!cancelled) setStep(0);
    }, 0);

    const t = window.setInterval(() => {
      setStep((prev) => (prev >= cap ? prev : prev + 1));
    }, intervalMs);
    return () => {
      cancelled = true;
      window.clearTimeout(kick);
      window.clearInterval(t);
    };
  }, [active, totalSteps, intervalMs, resetKey]);

  const cap = Math.max(0, totalSteps - 1);
  return Math.min(step, cap);
}

interface JobAiProgressStepsProps {
  labels: readonly string[];
  activeStepIndex: number;
  className?: string;
}

export function JobAiProgressSteps({
  labels,
  activeStepIndex,
  className,
}: JobAiProgressStepsProps) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {labels.map((label, i) => {
        const done = i < activeStepIndex;
        const current = i === activeStepIndex;
        return (
          <li key={i} className="flex gap-3 text-[13px] leading-snug sm:text-sm">
            <span className="mt-0.5 shrink-0" aria-hidden>
              {done ? (
                <Check className="h-4 w-4 text-primary" strokeWidth={2.25} />
              ) : current ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <span className="mx-1 my-2 block h-1 w-1 rounded-full bg-muted-foreground/35" />
              )}
            </span>
            <span
              className={cn(
                "min-w-0",
                done && "font-medium text-muted-foreground",
                current && "font-semibold text-foreground",
                !done && !current && "text-muted-foreground/45",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
