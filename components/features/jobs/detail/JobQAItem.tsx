"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { QAItem } from "@/types/jobs";

interface JobQAItemProps {
  item: QAItem;
  index: number;
}

export function JobQAItem({ item, index }: JobQAItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines = [`Q. ${item.question}`, "", `A. ${item.answer}`];
    if (item.followUps.length > 0) {
      lines.push("", "예상 꼬리 질문", ...item.followUps.map((f) => `- ${f}`));
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2.5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-relaxed text-foreground">
          Q{index + 1}. {item.question}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-0.5 flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-foreground font-medium">
        <span className="font-medium text-foreground">A. </span>
        {item.answer}
      </p>

      {item.followUps.length > 0 && (
        <div className="mt-1.5">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">
            예상 꼬리 질문
          </p>
          <ul className="space-y-1.5 pl-0.5">
            {item.followUps.map((fu, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground font-medium"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                {fu}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
