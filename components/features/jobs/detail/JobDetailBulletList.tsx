interface JobDetailBulletListProps {
  items: string[];
}

/** 채용 상세 본문 — 주요 업무·자격·우대 등 공통 bullet 목록 (줄간·bullet 정렬 통일) */
export function JobDetailBulletList({ items }: JobDetailBulletListProps) {
  if (!items.length) return null;
  return (
    <ul className="list-none space-y-2 pl-0">
      {items.map((item, i) => (
        <li
          key={`job-bullet-${i}`}
          className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-foreground"
        >
          <span
            className="mt-[0.42em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden
          />
          <span className="min-w-0 flex-1 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}
