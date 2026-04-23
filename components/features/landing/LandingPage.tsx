"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  ChevronRight,
  History,
  MessageSquare,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

// ─── Motion Helpers ───────────────────────────────────────────────────────────

/** 마운트 즉시 아래→위 fade (HeroSection용) */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** 뷰포트 진입 시 아래→위 fade (FeaturesSection 등 스크롤 섹션용) */
function FadeUpOnView({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** stagger 자식을 감싸는 컨테이너 */
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** stagger 개별 아이템 */
function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const itemVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

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
            className="rounded-lg bg-secondary text-foreground hover:bg-secondary/80 hover:text-foreground"
          >
            <Link href="/home">둘러보기</Link>
          </Button>
          <Button size="sm" asChild className="rounded-lg">
            <Link href="/auth">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

// 맥북 스타일 프리뷰 목업
function MacbookMockup() {
  return (
    <div className="select-none">
      {/* 화면 본체 */}
      <div className="relative rounded-[12px] bg-[#1e1e1e] p-[10px] pb-[8px] shadow-2xl ring-1 ring-black/40">
        {/* 카메라 노치 */}
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="h-[6px] w-[6px] rounded-full bg-[#3a3a3a]" />
        </div>

        {/* 스크린 영역 */}
        <div className="aspect-[16/10] overflow-hidden rounded-[6px] bg-black">
          <Image
            src="/preview.png"
            alt="Trace 앱 미리보기"
            width={1280}
            height={800}
            className="w-full object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* 힌지 */}
      <div className="mx-auto h-[4px] w-full rounded-none bg-gradient-to-b from-[#c8c8c8] to-[#b0b0b0]" />

      {/* 키보드 베이스 */}
      <div className="relative mx-auto w-[110%] -translate-x-[4.5%] rounded-b-[10px] bg-gradient-to-b from-[#d4d4d4] to-[#c0c0c0] px-6 pb-2 pt-1.5 shadow-md ring-1 ring-black/10">
        {/* 트랙패드 */}
        <div className="mx-auto h-[18px] w-[28%] rounded-[4px] bg-[#b8b8b8] ring-1 ring-black/10" />
      </div>
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
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-6 lg:gap-16">
          {/* ── 좌측: 텍스트 ── */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <FadeUp delay={0}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-3.5 w-3.5" />
                개발자 성장형 학습 플랫폼
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="mb-3 block">흩어진 개발 지식을</span>
                <span className="text-primary">하나의 학습 흐름으로</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mx-auto mb-8 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground md:mx-0">
                기술 블로그, AI 요약, 커뮤니티, 리포트까지.
                <br />
                흩어진 학습을 하나의 흐름으로 연결하세요.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 rounded-xl border-0 px-8 text-base bg-secondary text-foreground hover:bg-secondary/80 hover:text-foreground"
                >
                  <Link href="/home">로그인 없이 둘러보기</Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="h-12 rounded-xl px-8 has-[>svg]:px-8 text-base"
                >
                  <Link href="/auth">
                    로그인하기
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeUp>
          </div>

          {/* ── 우측: 제품 프리뷰 ── */}
          <FadeUp delay={0.45} className="relative hidden md:block">
            {/* 메인 노트북 목업: md에서 패딩 축소 */}
            <div className="px-0 pt-2 pb-3 lg:px-4 lg:pt-3 lg:pb-4">
              <MacbookMockup />
            </div>
          </FadeUp>
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
    containerBg: "bg-white",
    logo: "/icons/sources/stackoverflow.svg",
    logoPadding: "p-2",
  },
  {
    name: "Velog",
    sub: "",
    containerBg: "bg-white",
    logo: "/icons/sources/velog.svg",
    logoPadding: "",
  },
  {
    name: "NAVER D2",
    sub: "기술 블로그",
    containerBg: "bg-[#03C75A]",
    logo: "/icons/sources/naver.svg",
    logoPadding: "p-3.5",
  },
  {
    name: "Kakao Tech",
    sub: "",
    containerBg: "bg-[#FEE500]",
    logo: "/icons/sources/kakao.svg",
    logoPadding: "p-2",
  },
  {
    name: "Toss Tech",
    sub: "",
    containerBg: "bg-white",
    logo: "/icons/sources/toss.png",
    logoPadding: "p-0.5",
  },
  {
    name: "OliveYoung Tech",
    sub: "",
    containerBg: "bg-white",
    logo: "/icons/sources/oliveyoung.svg",
    logoPadding: "p-1.5",
  },
  {
    name: "Medium",
    sub: "당근 · 무신사 · 마이리얼트립 · 넷플릭스",
    containerBg: "bg-white",
    logo: "/icons/sources/medium.svg",
    logoPadding: "",
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
    desc: "긴 글을 4가지 레벨에 맞게 요약하고, AI 퀴즈로 이해도를 바로 점검하세요.",
  },
  {
    icon: Users,
    title: "개발자 커뮤니티",
    desc: "궁금한 것을 질문하고 사용자들의 답변을 받아보세요. AI가 생성한 1차 답변도 함께 제공됩니다.",
  },
  {
    icon: MessageSquare,
    title: "AI 질문 개선",
    desc: "AI가 질문을 다듬어 더 좋은 답변을 받을 수 있도록 도와드립니다.",
  },
  {
    icon: History,
    title: "히스토리 & 배지",
    desc: "읽은 글, 퀴즈 결과, 활동 내역 등을 타임라인으로 기록하고 배지를 획득하세요.",
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
        <FadeUpOnView className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            학습에 필요한 모든 것
          </h2>
          <p className="mt-4 text-muted-foreground">
            흩어진 개발 학습 도구를 하나의 플랫폼에서 경험하세요.
          </p>
        </FadeUpOnView>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title} className="h-full">
                <div className="h-full rounded-xl bg-card p-6 transition-shadow hover:shadow-md">
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
              </StaggerItem>
            );
          })}
        </motion.div>

        {/* 콘텐츠 소스 — Features 보강 정보 블록 */}
        <FadeUpOnView delay={0.1} className="mx-auto mt-12 max-w-4xl pt-10">
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
                  className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg shadow-sm ${source.containerBg} ${source.logoPadding}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={source.logo}
                    alt={source.name}
                    className="h-full w-full object-contain"
                  />
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
        </FadeUpOnView>
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
        <FadeUpOnView className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            하나의 흐름으로 연결된 학습
          </h2>
          <p className="mt-4 text-muted-foreground font-medium">
            탐색부터 기록까지, 개발자 성장의 전 과정을 지원합니다.
          </p>
        </FadeUpOnView>

        <motion.div
          className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.label}>
                <StaggerItem className="flex flex-1 flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">{step.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    {step.desc}
                  </p>
                </StaggerItem>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden items-center justify-center pt-5 sm:flex">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </motion.div>
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
            variant="outline"
            asChild
            className="h-12 rounded-xl border-0 px-8 text-base bg-white/15 text-white hover:bg-white/25 hover:text-white"
          >
            <Link href="/home">지금 둘러보기</Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="h-12 px-8 has-[>svg]:px-8 text-base rounded-xl bg-white text-foreground hover:bg-white/90"
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
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/home");
    }
  }, [isInitialized, isAuthenticated, router]);

  // 초기화 전 — 인증 여부 불명확, 아무것도 렌더하지 않음
  if (!isInitialized) return null;
  // 로그인 상태 — useEffect에서 /home 이동 대기, 랜딩 UI 노출 차단
  if (isAuthenticated) return null;

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
