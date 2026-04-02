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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/home">둘러보기</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pb-24 pt-32">
      {/* 배경 장식 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
        {/* 상단 뱃지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          개발자 성장형 학습 플랫폼
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span className="block mb-3">개발자의 학습을</span>
          <span className="text-primary">더 스마트하게</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground font-medium sm:text-xl">
          기술 블로그, AI 요약, 커뮤니티, 리포트까지.
          <br className="hidden sm:block" />
          흩어진 학습을 하나의 흐름으로 연결하세요.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="h-12 px-8 text-base">
            <Link href="/auth">
              로그인하기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-12 px-8 text-base"
          >
            <Link href="/home">로그인 없이 둘러보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BookOpen,
    title: "맞춤형 기술 피드",
    desc: "직무와 기술 스택을 기반으로 선별된 개발 아티클을 매일 받아보세요.",
  },
  {
    icon: Search,
    title: "Stack Overflow 탐색",
    desc: "Stack Overflow 질문과 답변을 피드 형태로 탐색하고 학습하세요.",
  },
  {
    icon: Zap,
    title: "AI 요약 & 퀴즈",
    desc: "긴 글을 레벨에 맞게 요약하고, AI 퀴즈로 이해도를 바로 점검하세요.",
  },
  {
    icon: Users,
    title: "개발자 커뮤니티",
    desc: "궁금한 것을 질문하고 AI 1차 답변과 동료 개발자의 인사이트를 얻으세요.",
  },
  {
    icon: Flame,
    title: "트렌드 키워드",
    desc: "지금 개발 생태계에서 가장 주목받는 기술 키워드를 한눈에 확인하세요.",
  },
  {
    icon: BarChart2,
    title: "학습 히스토리 & 리포트",
    desc: "읽은 글, 퀴즈 결과, 활동 내역을 기록하고 주간 성장 리포트를 받아보세요.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-muted/40 py-24">
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
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            );
          })}
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
          <p className="mt-4 text-muted-foreground">
            탐색부터 기록까지, 개발자 성장의 전 과정을 지원합니다.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.label}>
                <div className="flex flex-1 flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{step.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
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
        <p className="mb-8 text-primary-foreground/80">
          로그인 없이도 피드와 커뮤니티를 바로 둘러볼 수 있습니다.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="h-12 px-8 text-base"
          >
            <Link href="/home">지금 둘러보기</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-12 border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
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

          <p className="text-sm text-muted-foreground">
            © 2026 Trace. 개발자 성장형 통합 플랫폼.
          </p>

          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
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
