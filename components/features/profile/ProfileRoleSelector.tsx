"use client";

import { cn } from "@/lib/utils";
import { JOB_ROLES, type JobRoleId } from "./constants";

interface ProfileRoleSelectorProps {
  value: JobRoleId | null;
  onChange: (value: JobRoleId) => void;
}

export function ProfileRoleSelector({
  value,
  onChange,
}: ProfileRoleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {JOB_ROLES.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onChange(role.id)}
          className={cn(
            "rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200",
            value === role.id
              ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
              : "border-border bg-secondary text-foreground hover:border-primary/40 hover:bg-secondary/80",
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
