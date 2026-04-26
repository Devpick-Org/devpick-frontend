import { groupJobDetailLines } from "@/lib/jobs/jobDetailListGroup";

interface JobDetailStructuredListProps {
  items: string[];
}

/**
 * 소제목(필수·우대·번호 제목 등)과 하위 항목을 구분해 표시.
 * 하위 항목은 `-` + 들여쓰기로 가독성 통일.
 */
export function JobDetailStructuredList({ items }: JobDetailStructuredListProps) {
  const groups = groupJobDetailLines(items);
  if (!groups.length) return null;

  return (
    <div className="flex flex-col gap-5">
      {groups.map((g, gi) => (
        <div key={`jd-grp-${gi}`} className="flex flex-col gap-2.5">
          {g.heading && (
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {g.heading}
            </h3>
          )}
          {g.items.length > 0 && (
            <ul
              className={
                g.heading
                  ? "ml-0 space-y-2 border-l-2 border-primary/20 pl-3.5 sm:pl-4"
                  : "ml-0 space-y-2"
              }
            >
              {g.items.map((item, ii) => (
                <li
                  key={`jd-it-${gi}-${ii}`}
                  className="flex items-start gap-2 text-sm font-medium leading-relaxed text-foreground"
                >
                  <span
                    className="mt-[0.4em] shrink-0 font-normal text-muted-foreground"
                    aria-hidden
                  >
                    -
                  </span>
                  <span className="min-w-0 flex-1 break-words">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
