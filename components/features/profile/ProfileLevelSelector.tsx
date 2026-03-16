"use client";

import { cn } from "@/lib/utils";
import { LEVELS, type LevelId } from "./constants";

interface ProfileLevelSelectorProps {
  value: LevelId | null;
  onChange: (value: LevelId) => void;
}

export function ProfileLevelSelector({
  value,
  onChange,
}: ProfileLevelSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {LEVELS.map((level) => (
        <button
          key={level.id}
          type="button"
          onClick={() => onChange(level.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 transition-all duration-200",
            value === level.id
              ? "bg-primary/10"
              : "bg-secondary hover:bg-secondary/80",
          )}
        >
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              value === level.id ? "text-primary" : "text-foreground",
            )}
          >
            {level.label}
          </span>
          <span className="text-xs text-muted-foreground">{level.sub}</span>
        </button>
      ))}
    </div>
  );
}
