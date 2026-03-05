import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    outline: "border-border text-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
