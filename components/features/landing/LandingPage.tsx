import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  ChevronRight,
  Flame,
  History,
  MessageSquare,
  Search,
  Users,
  Zap,
} from "lucide-react";

// ─── 공통 로고 SVG ────────────────────────────────────────────────────────────
function TraceLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// ─── Landing Navigation ───────────────────────────────────────────────────────
function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white shadow-md shadow-black/1">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/15">
            <TraceLogo className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Trace
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-full bg-secondary text-foreground hover:bg-secondary/80 hover:text-foreground"
          >
            <Link href="/home">둘러보기</Link>
          </Button>
          <Button size="sm" asChild className="rounded-full">
            <Link href="/auth">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

// 목업 내부 피드 카드
function MockFeedCard({
  title,
  source,
  tags,
}: {
  title: string;
  source: string;
  tags: string[];
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <p className="mb-1.5 line-clamp-2 text-[11px] font-medium leading-snug text-foreground">
        {title}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{source}</span>
        <div className="flex gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 제품 프리뷰 목업
function LaptopMockup() {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* 브라우저 크롬 */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <div className="ml-2 flex-1 rounded-md border border-border bg-background px-3 py-0.5 text-center text-[11px] text-muted-foreground">
            trace.dev/home
          </div>
        </div>

        {/* 앱 네비게이션 바 */}
        <div className="flex items-center justify-between border-b border-border bg-card px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-primary/15" />
            <span className="text-[10px] font-bold text-foreground">Trace</span>
          </div>
          <div className="flex gap-3">
            {["홈", "커뮤니티", "트렌드"].map((item) => (
              <span key={item} className="text-[9px] text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
          <div className="h-5 w-5 rounded-full bg-muted" />
        </div>

        {/* 앱 콘텐츠 */}
        <div className="flex h-[220px] lg:h-[272px]">
          {/* 피드 영역 */}
          <div className="flex-1 space-y-2 overflow-hidden p-3">
            {/* 검색바 */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5">
              <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                기술 키워드, 아티클 검색...
              </span>
            </div>
            {/* 피드 카드 */}
            <MockFeedCard
              title="React 19 useTransition 완전 정복"
              source="Velog"
              tags={["React", "Frontend"]}
            />
            <MockFeedCard
              title="Next.js App Router 데이터 패칭 전략"
              source="Medium"
              tags={["Next.js"]}
            />
            <MockFeedCard
              title="TypeScript 5.x 제네릭 패턴 정리"
              source="Dev.to"
              tags={["TypeScript"]}
            />
          </div>

          {/* 우측 추천 사이드바: md에서 숨겨 피드 영역 최대 확보 */}
          <div className="hidden w-[96px] shrink-0 space-y-2 border-l border-border p-2.5 lg:block">
            <p className="text-[10px] font-semibold text-muted-foreground">
              추천 콘텐츠
            </p>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="space-y-1 rounded-md border border-border p-1.5"
              >
                <div className="h-1.5 w-full rounded bg-muted" />
                <div className="h-1.5 w-3/4 rounded bg-muted" />
                <div className="mt-1 h-1.5 w-1/2 rounded bg-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 노트북 받침 */}
      <div className="mx-auto h-2.5 w-[92%] rounded-b-xl border border-t-0 border-border bg-muted" />
      <div className="mx-auto h-1.5 w-[55%] rounded-b-lg bg-muted/60" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pb-32 pt-36">
      {/* 배경 장식 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-6 lg:gap-16">
          {/* ── 좌측: 텍스트 ── */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              개발자 성장형 학습 플랫폼
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="mb-3 block">흩어진 개발 지식을</span>
              <span className="text-primary">하나의 학습 흐름으로</span>
            </h1>

            <p className="mx-auto mb-8 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground md:mx-0">
              기술 블로그, AI 요약, 커뮤니티, 리포트까지.
              <br />
              흩어진 학습을 하나의 흐름으로 연결하세요.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full px-8 has-[>svg]:px-8 text-base"
              >
                <Link href="/auth">
                  로그인하기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-0 px-8 text-base bg-secondary text-foreground hover:bg-secondary/80 hover:text-foreground"
              >
                <Link href="/home">로그인 없이 둘러보기</Link>
              </Button>
            </div>
          </div>

          {/* ── 우측: 제품 프리뷰 ── */}
          <div className="relative hidden md:block">
            {/* Floating: 트렌드 키워드 카드
                md: 카드 안쪽에 붙이고 크기 축소 / lg: 바깥으로 삐져나옴 */}
            <div className="absolute left-0 top-6 z-20 w-28 translate-x-0 rounded-xl border border-border bg-card p-2.5 shadow-lg lg:w-36 lg:-translate-x-1/4 lg:p-3">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground lg:mb-2 lg:text-[10px]">
                트렌드 키워드
              </p>
              {[
                { kw: "TypeScript", delta: "+12%" },
                { kw: "React 19", delta: "+8%" },
                { kw: "Docker", delta: "+5%" },
              ].map(({ kw, delta }) => (
                <div
                  key={kw}
                  className="flex items-center justify-between py-0.5"
                >
                  <span className="text-[10px] text-foreground">#{kw}</span>
                  <span className="text-[9px] font-semibold text-green-500 lg:text-[10px]">
                    {delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating: AI 요약 카드
                md: 카드 안쪽에 붙이고 크기 축소 / lg: 바깥으로 삐져나옴 */}
            <div className="absolute bottom-6 right-0 z-20 w-36 translate-x-0 rounded-xl border border-border bg-card p-2.5 shadow-lg lg:w-44 lg:translate-x-1/4 lg:p-3">
              <div className="mb-1.5 flex items-center gap-1.5 lg:mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <span className="text-[10px] font-semibold text-foreground">
                  AI 요약 완료
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-muted" />
                <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                <div className="h-1.5 w-3/5 rounded-full bg-muted" />
                <div className="mt-2 flex gap-1">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
                    React
                  </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">
                    Hooks
                  </span>
                </div>
              </div>
            </div>

            {/* 메인 노트북 목업: md에서 패딩 축소 */}
            <div className="px-3 pt-3 pb-4 lg:px-8 lg:pt-4 lg:pb-6">
              <LaptopMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sources Section ─────────────────────────────────────────────────────────
const SOURCES = [
  {
    name: "Stack Overflow",
    sub: "",
    bg: "bg-[#F48024]",
    textColor: "text-white",
    initial: "SO",
  },
  {
    name: "Velog",
    sub: "",
    bg: "bg-[#20C997]",
    textColor: "text-white",
    initial: "V",
  },
  {
    name: "Medium",
    sub: "당근 · 직방 · 왓챠",
    bg: "bg-neutral-900",
    textColor: "text-white",
    initial: "M",
  },
  {
    name: "네이버",
    sub: "기술 블로그",
    bg: "bg-[#03C75A]",
    textColor: "text-white",
    initial: "N",
  },
  {
    name: "토스",
    sub: "기술 블로그",
    bg: "bg-[#0064FF]",
    textColor: "text-white",
    initial: "T",
  },
  {
    name: "카카오",
    sub: "기술 블로그",
    bg: "bg-[#FEE500]",
    textColor: "text-neutral-900",
    initial: "K",
  },
];

// ─── Features Section ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BookOpen,
    title: "맞춤형 기술 피드",
    desc: "Velog, Medium, Stack Overflow 등 여러 기술 블로그를 한데 모아 직무와 기술 스택에 맞게 보여드립니다.",
  },
  {
    icon: Zap,
    title: "AI 요약 & 퀴즈",
    desc: "긴 글을 레벨에 맞게 요약하고, AI 퀴즈로 이해도를 바로 점검하세요.",
  },
  {
    icon: Users,
    title: "개발자 커뮤니티 & AI 질문 개선",
    desc: "궁금한 것을 질문하고, AI가 다듬어준 질문으로 더 좋은 답변을 받아보세요.",
  },
  {
    icon: Flame,
    title: "트렌드 키워드",
    desc: "지금 개발 생태계에서 가장 주목받는 기술 키워드를 한눈에 확인하세요.",
  },
  {
    icon: History,
    title: "히스토리 & 배지",
    desc: "읽은 글, 퀴즈 결과, 활동 내역을 타임라인으로 기록하고 배지를 획득하세요.",
  },
  {
    icon: BarChart2,
    title: "주간 학습 리포트",
    desc: "한 주간의 학습 패턴을 차트로 분석하고, 리포트를 공유하세요.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-muted/40 pt-16 pb-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            학습에 필요한 모든 것
          </h2>
          <p className="mt-4 text-muted-foreground">
            흩어진 개발 학습 도구를 하나의 플랫폼에서 경험하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 콘텐츠 소스 — Features 보강 정보 블록 */}
        <div className="mx-auto mt-12 max-w-4xl pt-10">
          <p className="mb-12 text-center text-md font-medium text-muted-foreground">
            이런 플랫폼의 기술 콘텐츠를 모아요.
          </p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
            {SOURCES.map((source) => (
              <div
                key={source.name}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-sm ${source.bg}`}
                >
                  <span className={`text-sm font-bold ${source.textColor}`}>
                    {source.initial}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {source.name}
                  </p>
                  {source.sub && (
                    <p className="text-xs font-medium leading-tight text-muted-foreground">
                      {source.sub}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Flow Section ─────────────────────────────────────────────────────────────
const FLOW_STEPS = [
  { icon: Search, label: "탐색", desc: "맞춤 피드로 콘텐츠 발견" },
  { icon: Zap, label: "학습", desc: "AI 요약 & 퀴즈로 빠른 이해" },
  { icon: MessageSquare, label: "질문", desc: "커뮤니티에서 심화 토론" },
  { icon: History, label: "기록", desc: "히스토리 & 리포트로 성장 추적" },
];

function FlowSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            하나의 흐름으로 연결된 학습
          </h2>
          <p className="mt-4 text-muted-foreground font-medium">
            탐색부터 기록까지, 개발자 성장의 전 과정을 지원합니다.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.label}>
                <div className="flex flex-1 flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{step.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    {step.desc}
                  </p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden items-center justify-center pt-5 sm:flex">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Bottom CTA Section ───────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="mb-8 text-primary-foreground/80 font-medium">
          로그인 없이도 피드와 커뮤니티를 바로 둘러볼 수 있습니다.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center ">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="h-12 px-8 text-base rounded-full bg-white text-foreground hover:bg-white/90"
          >
            <Link href="/home">지금 둘러보기</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-12 rounded-full border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/auth">
              로그인 시작하기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/15">
              <TraceLogo className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">Trace</span>
          </Link>

          <p className="text-sm text-muted-foreground font-medium">
            © 2026 Trace. 개발자 성장형 통합 플랫폼.
          </p>

          <nav className="flex items-center gap-5 text-sm text-muted-foreground font-medium">
            <Link
              href="/home"
              className="transition-colors hover:text-foreground"
            >
              피드
            </Link>
            <Link
              href="/community"
              className="transition-colors hover:text-foreground"
            >
              커뮤니티
            </Link>
            <Link
              href="/trends"
              className="transition-colors hover:text-foreground"
            >
              트렌드
            </Link>
            <Link
              href="/auth"
              className="transition-colors hover:text-foreground"
            >
              로그인
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <FlowSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
