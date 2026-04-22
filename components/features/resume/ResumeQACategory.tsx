"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QACategory } from "@/types/jobs";
import { JobQAItem } from "@/components/features/jobs/detail/JobQAItem";

interface ResumeQACategoryProps {
  category: QACategory;
  initialOpen?: boolean;
}

export function ResumeQACategory({
  category,
  initialOpen = false,
}: ResumeQACategoryProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {category.title}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {category.items.length}문항
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 cursor-pointer text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div className="divide-y divide-border">
          {category.items.map((item, i) => (
            <JobQAItem key={i} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
