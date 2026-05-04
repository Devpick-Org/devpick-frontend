"use client";

import { Input } from "@/components/ui/input";

interface ProfileNicknameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProfileNicknameInput({
  value,
  onChange,
}: ProfileNicknameInputProps) {
  return (
    <div>
      <Input
        type="text"
        placeholder="사용할 닉네임을 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={20}
        className="h-11 bg-secondary text-foreground font-medium placeholder:text-muted-foreground focus-visible:!ring-0 focus-visible:!border-border focus-visible:outline-none"
      />
      <p className="mt-1.5 text-xs text-muted-foreground font-medium">{`${value.length}/20자`}</p>
    </div>
  );
}
