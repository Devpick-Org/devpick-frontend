import { cn } from "@/lib/utils";

interface JobDetailSectionProps {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
  action?: React.ReactNode;
}

export function JobDetailSection({
  title,
  children,
  titleClassName,
  action,
}: JobDetailSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2
          className={cn(
            "text-base font-semibold text-foreground",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
