// ContentDetail 및 Stack Overflow 본문 렌더링에 공통으로 사용하는 마크다운 렌더러

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-sm text-primary"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <div
          key={key++}
          className="my-6 overflow-hidden rounded-xl border border-border"
        >
          {lang && (
            <div className="flex items-center gap-2 border-b border-border bg-secondary/80 px-4 py-2">
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {lang}
              </span>
            </div>
          )}
          <pre className="overflow-x-auto bg-[#0d1117] p-4">
            <code className="block font-mono text-sm leading-relaxed text-[#e6edf3]">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="mb-4 mt-10 text-xl font-bold tracking-tight text-foreground first:mt-0 md:text-2xl"
        >
          {line.replace("## ", "")}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="mb-3 mt-8 text-lg font-semibold text-foreground"
        >
          {line.replace("### ", "")}
        </h3>,
      );
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-4 ml-6 list-decimal space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-base leading-relaxed text-foreground/85">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(lines[i].trim().replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 ml-6 list-disc space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-base leading-relaxed text-foreground/85">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="my-4 text-base leading-7 text-foreground/85">
        <InlineMarkdown text={line} />
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}
