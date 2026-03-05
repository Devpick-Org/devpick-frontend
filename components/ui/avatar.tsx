"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type ImageStatus = "idle" | "loaded" | "error";

const AvatarContext = createContext<{
  status: ImageStatus;
  setStatus: (s: ImageStatus) => void;
}>({ status: "idle", setStatus: () => {} });

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  const [status, setStatus] = useState<ImageStatus>("idle");

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <span
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        )}
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  const { setStatus } = useContext(AvatarContext);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={() => setStatus("loaded")}
      onError={() => setStatus("error")}
    />
  );
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  const { status } = useContext(AvatarContext);

  if (status === "loaded") return null;

  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
