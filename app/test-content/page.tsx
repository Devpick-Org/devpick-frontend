import { ContentRenderer } from "@/components/features/home/ContentRenderer";

const NORMAL_HTML = `
<h2>제목 테스트</h2>
<p>이건 <strong>굵은 글씨</strong>와 <code>inline code</code>가 있는 문단입니다.</p>
<ul>
  <li>리스트 1</li>
  <li>리스트 2</li>
</ul>
<pre><code>const hello = "world";</code></pre>
<blockquote>인용문 테스트</blockquote>
<a href="https://example.com" target="_blank">링크 테스트</a>
`;

const XSS_HTML = `
<h2>sanitize 테스트</h2>
<p onclick="alert('xss')">이 이벤트는 제거되어야 합니다</p>
<img src="x" onerror="alert('xss')" />
<script>alert('xss')</script>
<p>정상 문단은 보여야 합니다</p>
`;

interface SectionProps {
  title: string;
  description: string;
  html: string;
}

function Section({ title, description, html }: SectionProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-1 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="rounded-lg border border-border/60 bg-background p-4">
        <ContentRenderer content={html} />
      </div>
    </section>
  );
}

export default function TestContentPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          ContentRenderer 테스트
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          HTML 렌더링, typography 스타일, DOMPurify sanitize 동작을 확인합니다.
        </p>
      </div>

      <div className="space-y-8">
        <Section
          title="정상 렌더링 테스트"
          description="h2, p, ul, pre/code, blockquote, a 태그가 스타일과 함께 렌더링되는지 확인합니다."
          html={NORMAL_HTML}
        />
        <Section
          title="sanitize 테스트"
          description="script 태그 제거, onclick/onerror 속성 제거, 정상 태그 유지를 확인합니다."
          html={XSS_HTML}
        />
      </div>
    </main>
  );
}
