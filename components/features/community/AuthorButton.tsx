"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AuthorButtonProps {
  userId: string;
  nickname: string;
  profileImage?: string | null;
  avatarSize?: "sm" | "default";
  className?: string;
  onOpenProfile: (userId: string) => void;
}

export function AuthorButton({
  userId,
  nickname,
  profileImage,
  avatarSize = "sm",
  className,
  onOpenProfile,
}: AuthorButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenProfile(userId);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md transition-opacity hover:opacity-70 cursor-pointer",
        className,
      )}
    >
      <Avatar size={avatarSize}>
        {profileImage && <AvatarImage src={profileImage} alt={nickname} />}
        <AvatarFallback>{nickname.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-medium truncate">{nickname}</span>
    </button>
  );
}
