# DevPick Frontend - Claude Code Context

당신은 'DevPick' 프론트엔드 개발 전문가입니다. 이 문서를 바탕으로 프로젝트의 문맥을 이해하고 가이드라인을 준수하세요.

> **참고**: 이 문서는 프로젝트 전체의 아키텍처, 기술 스택, API 명세, 코드 컨벤션 및 CI/CD 전략을 정의하는 단일 진실 공급원(SSOT, Single Source of Truth)입니다.

---

## 1. 프로젝트 개요

**DevPick** — 개발자 성장형 통합 플랫폼

> 개발 콘텐츠 탐색 → AI 요약/질문 → 커뮤니티 소통 → 성장 기록/리포트를 하나의 흐름으로 연결

이 레포는 **Next.js (App Router) 기반 프론트엔드 웹 애플리케이션**이다.

- 프론트엔드 담당: **홍보민**
- MVP 데드라인: **2026-03-22**
- 현재 스프린트: Sprint 2 (3/16 ~ 3/22) — Epic C, D, E, F

### 시스템 구조 (4개 서버)

```
브라우저 → Nginx → Next.js (프론트, :3000)
                 → Spring Boot (백엔드, :8080) → PostgreSQL (:5432)
                                               → MongoDB (:27017)
                                               → Redis (:6379)
                                               → FastAPI AI 서버 (:8000)
```

---

## 2. 기술 스택

| 구분            | 기술                 | 버전 |
| --------------- | -------------------- | ---- |
| 언어            | TypeScript           | 최신 |
| 프레임워크      | Next.js (App Router) | 16.x |
| 스타일링        | Tailwind CSS         | 4.x  |
| 클라이언트 상태 | Zustand              | 최신 |
| 서버 상태       | TanStack Query       | v5   |
| 데이터 시각화   | Recharts             | 최신 |
| 마크다운 렌더링 | react-markdown       | 최신 |
| 아이콘          | Lucide React         | 최신 |
| 패키지 매니저   | npm                  | 최신 |
| 린트/포맷팅     | ESLint + Prettier    | -    |
| CI/CD           | GitHub Actions       | -    |

---

## 3. 폴더 구조 (App Router + Route Group)

```
├── app/
│ ┣ (auth)/              # Route Group — GNB 없는 레이아웃 (로그인/회원가입)
│ ┃ ┗ page.tsx           # / (로그인·회원가입 통합 페이지)
│ ┣ (main)/              # Route Group — GNB 있는 레이아웃
│ ┃ ┣ layout.tsx         # TopNavVariant + QueryClientProvider
│ ┃ ┣ home/              # 맞춤형 아티클 피드 (메인)
│ ┃ ┃ ┣ [id]/            # 글 상세 및 AI 요약 뷰어
│ ┃ ┃ ┃ ┗ page.tsx       # 클라이언트 컴포넌트 — useParams, useQuery(content + recommendations), 2단 레이아웃
│ ┃ ┃ ┗ page.tsx         # 개인화 피드 목록 (무한 스크롤)
│ ┃ ┣ community/         # 커뮤니티 피드 (질문/게시글 목록)
│ ┃ ┃ ┣ write/           # 커뮤니티 글쓰기 및 AI 질문 개선
│ ┃ ┃ ┃ ┗ page.tsx
│ ┃ ┃ ┣ [id]/            # 게시글 상세 및 AI/유저 답변
│ ┃ ┃ ┃ ┗ page.tsx
│ ┃ ┃ ┗ page.tsx
│ ┃ ┣ history/           # 학습 히스토리 (학습/활동 탭)
│ ┃ ┃ ┗ page.tsx
│ ┃ ┣ profile/           # 내 프로필, 스크랩, 활동 내역
│ ┃ ┃ ┗ page.tsx
│ ┃ ┗ report/            # 주간 학습 분석 리포트 대시보드
│ ┃   ┗ page.tsx
│ ┣ auth/                # provider별 콜백 라우트 (Route Group 밖)
│ ┃ ┣ github/
│ ┃ ┃ ┗ callback/
│ ┃ ┃   ┗ page.tsx       # GitHub OAuth code/state 수신 → 백엔드 콜백 호출 → 상태 저장 후 이동
│ ┃ ┗ google/
│ ┃   ┗ callback/
│ ┃     ┗ page.tsx       # Google OAuth code/state 수신 → 백엔드 콜백 호출 → 상태 저장 후 이동
│ ┣ onboarding/          # 초기 사용자 성향 파악 온보딩
│ ┃ ┣ layout.tsx         # 온보딩 전용 레이아웃
│ ┃ ┗ page.tsx
│ ┣ report/              # 리포트 공유 라우트 (Route Group 밖 — GNB 없는 독립 레이아웃)
│ ┃ ┗ share/
│ ┃   ┣ layout.tsx       # 공유 페이지 전용 레이아웃
│ ┃   ┗ [token]/
│ ┃     ┗ page.tsx       # 공유 토큰으로 리포트 열람 (비로그인 접근 가능)
│ ┣ favicon.ico          # 파비콘
│ ┣ globals.css          # 전역 스타일 및 Tailwind CSS 설정 (@theme 토큰)
│ ┗ layout.tsx           # Root Layout (HTML shell — html, body 태그만)
├── components/
│ ┣ ui/                  # 재사용 프리미티브 (shadcn/ui 기반)
│ ┃ ┣ alert-dialog.tsx   # AlertDialog (확인/취소 모달)
│ ┃ ┣ avatar.tsx         # Avatar + AvatarImage + AvatarFallback
│ ┃ ┣ badge.tsx          # Badge (variant: default/secondary/outline/destructive)
│ ┃ ┣ button.tsx
│ ┃ ┣ card.tsx
│ ┃ ┣ dialog.tsx
│ ┃ ┣ dropdown-menu.tsx  # 자체 구현 (radix 미사용)
│ ┃ ┣ input.tsx
│ ┃ ┣ label.tsx
│ ┃ ┣ skeleton.tsx
│ ┃ ┗ tabs.tsx
│ ┣ layout/              # GNB, 사이드바 등 레이아웃 컴포넌트
│ ┃ ┣ Sidebar.tsx        # 데스크탑 사이드바 + 모바일 하단 탭바 (현재 미사용)
│ ┃ ┣ ScrollToTopButton.tsx # 스크롤 최상단 이동 버튼
│ ┃ ┣ TopNav.tsx         # 상단 GNB 구버전 (현재 미사용)
│ ┃ ┗ TopNavVariant.tsx  # 상단 GNB + 모바일 하단 탭바 (현재 운영)
│ ┣ features/            # 도메인별 기능 컴포넌트
│ ┃ ┣ auth/              # 인증 화면 컴포넌트
│ ┃ ┃ ┣ AuthCallbackPage.tsx  # provider별 OAuth 콜백 공통 처리 UI/로직 (code/state 파싱 → 콜백 API 호출 → 토큰 저장 → 리다이렉트)
│ ┃ ┃ ┣ AuthContainer.tsx    # 로그인/회원가입 탭 전환 래퍼
│ ┃ ┃ ┣ AuthInitializer.tsx  # 앱 마운트 시 토큰 복원 및 인증 상태 초기화
│ ┃ ┃ ┣ EmailSection.tsx     # 이메일 인증 코드 발송·검증 UI
│ ┃ ┃ ┣ LoginForm.tsx        # 로그인 폼 (react-hook-form + zod)
│ ┃ ┃ ┣ SignupForm.tsx       # 회원가입 폼 (react-hook-form + zod)
│ ┃ ┃ ┗ SocialAuthButtons.tsx # GitHub / Google 소셜 로그인 버튼
│ ┃ ┣ home/
│ ┃ ┃ ┣ AiSummary.tsx        # AI 요약 렌더러 (레벨별 요약, 키포인트, 키워드 등)
│ ┃ ┃ ┣ ContentDetail.tsx    # 글 상세 뷰어 ("use client", 마크다운 렌더링 + 좋아요/스크랩/공유)
│ ┃ ┃ ┣ FeedCard.tsx         # 피드 카드 (FeedCardItem interface)
│ ┃ ┃ ┣ FeedSearch.tsx       # 피드 검색 입력 컴포넌트
│ ┃ ┃ ┗ RecommendedContents.tsx # 추천 콘텐츠 사이드바 (서버 컴포넌트, items props)
│ ┃ ┣ community/
│ ┃ ┃ ┣ AiAnswerSection.tsx      # AI 답변 생성 요청 및 결과 렌더링
│ ┃ ┃ ┣ AnswerList.tsx           # 답변 목록 (댓글/채택/수정/삭제 포함)
│ ┃ ┃ ┣ AnswerSection.tsx        # 답변 작성 폼 및 전체 답변 영역 (useMutation)
│ ┃ ┃ ┣ CommunityCard.tsx        # 커뮤니티 카드 (CommunityPost interface)
│ ┃ ┃ ┣ CommunityDetailPage.tsx  # 상세 페이지 레이아웃 (useQuery, 좌: 본문+답변, 우: 유사질문)
│ ┃ ┃ ┣ CommunitySearch.tsx      # 커뮤니티 검색 입력 컴포넌트
│ ┃ ┃ ┣ ContentRenderer.tsx      # react-markdown 기반 마크다운 렌더러
│ ┃ ┃ ┣ PostDetail.tsx           # 게시글 제목/태그/본문/수정·삭제 메뉴
│ ┃ ┃ ┣ PostWriteForm.tsx        # 게시글 작성 폼 (제목/내용/태그 입력)
│ ┃ ┃ ┣ PostRefinePanel.tsx      # AI 질문 개선 패널 (우측 사이드 패널)
│ ┃ ┃ ┗ SimilarPosts.tsx         # 유사 질문 목록 사이드바
│ ┃ ┣ history/               # 히스토리 컴포넌트 (학습/활동 탭)
│ ┃ ┃ ┣ history.constants.ts # actionType 메타데이터 (label/icon/색상) + 필터 옵션 상수
│ ┃ ┃ ┣ HistoryTabsPage.tsx  # 학습/활동 탭 wrapper (페이지 진입점)
│ ┃ ┃ ┣ HistoryPage.tsx      # 학습 탭 — useQuery + 필터 상태 + groupByDate
│ ┃ ┃ ┣ HistoryContent.tsx   # 학습 탭 wrapper (isLoading/isError/empty 상태 분기 + HistoryFilterBar)
│ ┃ ┃ ┣ HistoryFilterBar.tsx # 액션 chip 필터 + 기간 dropdown
│ ┃ ┃ ┣ HistoryTimeline.tsx  # 날짜 그룹 헤더 + 타임라인 아이템 목록
│ ┃ ┃ ┣ HistoryTimelineItem.tsx # 단일 타임라인 아이템 (아이콘 노드 + 카드)
│ ┃ ┃ ┣ ActivityPage.tsx     # 활동 탭 — TODO: useQuery 연동 예정
│ ┃ ┃ ┗ ActivityContent.tsx  # 활동 탭 wrapper — TODO: ActivityList 연결 예정
│ ┃ ┣ profile/               # 프로필 설정 컴포넌트
│ ┃ ┃ ┣ constants.ts         # 직무/레벨/태그 상수 정의
│ ┃ ┃ ┣ ProfileEditForm.tsx  # 프로필 수정 폼 (닉네임/이미지/직무/레벨/태그)
│ ┃ ┃ ┣ ProfileLevelSelector.tsx  # 레벨 선택 (BEGINNER/JUNIOR/MIDDLE/SENIOR)
│ ┃ ┃ ┣ ProfileNicknameInput.tsx  # 닉네임 입력
│ ┃ ┃ ┣ ProfileRoleSelector.tsx   # 직무 선택 (FRONTEND/BACKEND/FULLSTACK)
│ ┃ ┃ ┗ ProfileTagSelector.tsx    # 기술 태그 선택
│ ┃ ┣ report/                # 주간 리포트 컴포넌트
│ ┃ ┃ ┣ ReportContent.tsx    # 리포트 콘텐츠 렌더러 (차트/인사이트 등)
│ ┃ ┃ ┣ ReportTabsPage.tsx   # 리포트 페이지 wrapper (주간 리포트 단독)
│ ┃ ┃ ┣ SharedReportPage.tsx # 공유 리포트 뷰어 (비로그인 접근용)
│ ┃ ┃ ┗ WeeklyReportPage.tsx # 주간 리포트 대시보드 (바 차트/레이더 차트/PDF 저장/공유)
│ ┃ ┗ onboarding/
│ ┃   ┗ OnboardingForm.tsx   # 온보딩 폼 (초기 성향 파악)
│ ┗ providers.tsx        # QueryClientProvider 등 클라이언트 Provider 래퍼
├── lib/
│ ┣ api/                 # API 클라이언트 (DP-190)
│ ┃ ┣ client.ts          # Axios 인스턴스 + 인터셉터 (401 → /auth/refresh → 재시도)
│ ┃ ┣ extractApiError.ts # API 에러 추출 유틸
│ ┃ ┗ endpoints/         # 도메인별 API 함수
│ ┃   ┣ auth.ts          # 로그인/회원가입/로그아웃/소셜 로그인 등
│ ┃   ┣ contents.ts      # 피드/상세/추천/좋아요/스크랩 등
│ ┃   ┣ history.ts       # 학습 히스토리 (HISTORY_QUERY_KEYS + historyEndpoints)
│ ┃   ┣ posts.ts         # 커뮤니티 게시글/답변/댓글
│ ┃   ┣ reports.ts       # 주간 리포트
│ ┃   ┗ users.ts         # 프로필 조회/수정/탈퇴
│ ┣ auth/                # 인증/토큰 관련 유틸
│ ┃ ┣ TokenStrategy.ts       # 토큰 저장 전략 인터페이스 (Strategy Pattern)
│ ┃ ┣ CookieStrategy.ts      # Cookie 기반 구현체 — Refresh Token HttpOnly Cookie 관리
│ ┃ ┣ SessionStorageStrategy.ts # SessionStorage 기반 구현체 — 현재 운영 정책상 미사용
│ ┃ ┣ tokenManager.ts        # 토큰 저장 전략 선택 및 CRUD 관리자
│ ┃ ┗ getAuthErrorMessage.ts # 인증 에러 코드 → 사용자 메시지 매핑
│ ┣ content/             # 콘텐츠 관련 유틸
│ ┃ ┣ getContentErrorMessage.ts    # 콘텐츠 에러 코드 → 사용자 메시지 매핑
│ ┃ ┗ updateContentInteractionCache.ts # 좋아요/스크랩 상태를 detail·피드·추천 캐시에 동시 반영 (TanStack Query)
│ ┣ mock/                # 개발용 목 데이터
│ ┃ ┣ aiSummary.ts       # AI 요약 목 데이터
│ ┃ ┣ community.ts       # 커뮤니티 상세 목 데이터 (게시글/답변/댓글/AI답변/유사질문)
│ ┃ ┣ history.ts         # 학습 히스토리 목 데이터 (최신순 정렬 + pagination)
│ ┃ ┣ posts.ts           # 커뮤니티 목록 목 데이터
│ ┃ ┗ reports.ts         # 주간 리포트 목 데이터
│ ┣ report/              # 리포트 관련 유틸
│ ┃ ┗ exportPdf.ts       # 리포트 PDF 내보내기
│ ┣ history/             # 히스토리 관련 유틸
│ ┃ ┗ groupByDate.ts    # PeriodFilter, DateGroup, filterByPeriod(), filterByActions(), groupByDate()
│ ┗ utils.ts             # cn(), formatDate(), formatDateTime(), formatTime(), formatWeekLabel()
├── store/               # Zustand 전역 상태 (DP-191)
│ ┣ auth.store.ts        # 인증 상태 (user, accessToken, isAuthenticated, setAuth, clearAuth)
│ ┣ content.store.ts     # 콘텐츠 관련 전역 상태
│ ┗ ui.store.ts          # UI 상태 (Toast 큐)
├── types/               # TypeScript 전역 타입 정의
│ ┣ api.ts               # ApiResponse<T>, ApiError, PaginatedData<T>
│ ┣ auth.ts              # User, LoginRequest, SignupRequest, SocialAuthResponse, RefreshTokenResponse 등 인증 타입
│ ┣ community.ts         # Post, Answer, Comment, AiAnswer 등 커뮤니티 상세 타입
│ ┣ content.ts           # Content, ContentDetail, ContentFeedData 등 콘텐츠 타입
│ ┣ history.ts           # HistoryItem, ActivityItem, HistoryPageData, HistoryParams 등 히스토리 타입
│ ┣ post.ts              # 커뮤니티 게시글 목록 타입
│ ┗ report.ts            # 주간 리포트 타입
└── public/              # 정적 에셋 (이미지, 폰트)
```

> **Route Group 규칙**: 괄호로 묶인 폴더명 `(auth)`, `(main)` 은 URL에 영향을 주지 않음.
>
> - `(auth)`: GNB 없음 (로그인 등 인증 전 화면)
> - `(main)`: GNB + QueryClientProvider 포함 (인증 후 메인 화면)
> - `auth/github/callback`, `auth/google/callback`: Route Group 밖에 위치 — OAuth Provider 인증 완료 후 `code`, `state`를 수신하는 전용 콜백 라우트

## 4. 자주 쓰는 커맨드

```bash
# 개발 서버 실행 (기본 포트 3000)
npm run dev

# 빌드 및 프로덕션 실행 테스트
npm run build
npm start

# 린트 검사
npm run lint

# 전체 서비스 한 번에 (devpick-infra에서)
cd ../devpick-infra && docker-compose up --build
```

---

## 5. 브랜치 / 커밋 / PR 규칙

### 브랜치

```bash
# develop에서 시작 (main 직접 작업 금지)
git checkout develop
git pull origin develop
git checkout -b feature/DP-{티켓번호}-{기능명}

# 예시
git checkout -b feature/DP-138-init-frontend
```

| 브랜치                       | 용도                        |
| ---------------------------- | --------------------------- |
| `main`                       | 배포용. 직접 push 절대 금지 |
| `develop`                    | 개발 통합. PR 머지 대상     |
| `feature/DP-{번호}-{기능명}` | 기능 개발                   |
| `hotfix/DP-{번호}-{설명}`    | 긴급 버그 수정              |

### 커밋 메시지

```
DP-{티켓번호}: {작업 내용}

예: DP-138: 프로젝트 초기 세팅
```

### PR 제목

```
[DP-{티켓번호}] {설명}

예: [DP-138] 프로젝트 초기 세팅
```

**머지 조건**: automerge 라벨 적용 + CI 빌드 통과 시 봇이 자동 Squash Merge

---

## 6. API 공통 포맷 (ADR-003)

### Base URL

| 환경  | Base URL                    |
| ----- | --------------------------- |
| local | `http://localhost:8080`     |
| prod  | `https://api.devpick.kr/v1` |

### 인증 방식

로그인이 필요한 API는 요청 헤더에 Access Token을 담아서 보낸다.

### 토큰 저장 방식

| 토큰          | 저장 위치                     | 설명                                               |
| ------------- | ----------------------------- | -------------------------------------------------- |
| Access Token  | 메모리 (전역 상태/Zustand 등) | XSS 방어 목적                                      |
| Refresh Token | HttpOnly Cookie               | JavaScript 접근 불가, 백엔드가 자동 설정/만료 처리 |

### 토큰 만료 시간

| 항목               | 값         |
| ------------------ | ---------- |
| Access Token 만료  | 1시간      |
| Refresh Token 만료 | 7일        |
| OAuth state TTL    | 5분, 1회용 |

**인증**: `Authorization: Bearer {access_token}`
**에러 처리**: 백엔드 공통 에러 포맷에 맞춰 클라이언트에서 토스트(Toast) 메시지 또는 에러 UI로 렌더링

### 성공 응답

```json
{
  "success": true,
  "data": {},
  "message": "요청이 성공했습니다"
}
```

### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "로그인이 필요합니다",
    "detail": "Access Token이 만료되었습니다"
  }
}
```

### 에러 코드 네임스페이스

| 접두사       | 도메인   |
| ------------ | -------- |
| `AUTH_`      | 인증     |
| `USER_`      | 사용자   |
| `CONTENT_`   | 콘텐츠   |
| `AI_`        | AI 기능  |
| `COMMUNITY_` | 커뮤니티 |

### HTTP 상태 코드

| 코드 | 의미                              |
| ---- | --------------------------------- |
| 200  | 성공                              |
| 201  | 생성 성공                         |
| 204  | 삭제 성공, 응답 본문 없음         |
| 400  | 잘못된 요청                       |
| 401  | 인증 필요 또는 토큰 문제          |
| 403  | 권한 없음                         |
| 404  | 찾을 수 없음                      |
| 500  | 서버 내부 오류                    |
| 502  | 외부 OAuth Provider API 호출 실패 |

- 인증 관련 API 클라이언트는 Axios 인스턴스 하나로 통합하고, 401 응답 시 `/auth/refresh` → accessToken 갱신 → 원 요청 재시도 흐름을 기본 정책으로 사용한다.

---

## 7. 코드 컨벤션

- **코드 품질**: ESLint 및 Prettier 설정을 필수로 준수하며, 빌드 전 모든 린트 에러를 해결
- **컴포넌트**: 모든 UI 컴포넌트는 **함수형 컴포넌트**로만 작성 (Class 컴포넌트 사용 금지)
- **타입 시스템**: TypeScript를 엄격하게 적용하며, **`any` 타입 사용을 절대 금지**. 모든 데이터와 Props는 명확한 `interface` 또는 `type`을 정의
- **상태 관리 규칙**:
  - **서버 상태(Server State)**: 모든 API 통신 및 데이터 동기화는 **TanStack Query (v5)**를 사용
  - **클라이언트 상태(Client State)**: 컴포넌트 간 공유가 필요한 전역 상태는 **Zustand**를 사용

| 대상       | 규칙                          | 예시            |
| ---------- | ----------------------------- | --------------- |
| 컴포넌트   | PascalCase                    | FeedCard.tsx    |
| 훅         | camelCase + use prefix        | useFeedList.ts  |
| 변수/함수  | camelCase                     | fetchContents   |
| 상수       | UPPER_SNAKE_CASE              | MAX_RETRY_COUNT |
| CSS 클래스 | Tailwind 유틸리티 클래스 사용 |                 |

---

## 8. API 엔드포인트 전체 목록

**Base URL**: https://api.devpick.kr/v1
**공통 에러**: ADR-003 (success, error 객체 포함) 준수

### Epic A — 회원/프로필

| Method | Endpoint                | 설명                                          | 인증 | 관련 페이지                      | 응답코드 |
| ------ | ----------------------- | --------------------------------------------- | ---- | -------------------------------- | -------- |
| POST   | `/auth/signup`          | 이메일 회원가입                               | X    | `/` (로그인/회원가입)            | 201      |
| POST   | `/auth/login`           | 이메일 로그인                                 | X    | `/` (로그인)                     | 200      |
| POST   | `/auth/logout`          | 로그아웃                                      | O    | Global (GNB)                     | 200      |
| POST   | `/auth/refresh`         | Access Token 재발급                           | X    | Axios Interceptor                | 200      |
| GET    | `/auth/github`          | GitHub OAuth 시작 URL 발급                    | X    | `/` (로그인)                     | 200      |
| GET    | `/auth/google`          | Google OAuth 시작 URL 발급                    | X    | `/` (로그인)                     | 200      |
| GET    | `/auth/github/callback` | GitHub 소셜 로그인 콜백                       | X    | `/auth/github/callback` (로그인) | 200      |
| GET    | `/auth/google/callback` | Google 소셜 로그인 콜백                       | X    | `/auth/google/callback` (로그인) | 200      |
| GET    | `/users/me`             | 내 프로필 조회                                | O    | `/profile`, `/onboarding`        | 200      |
| PUT    | `/users/me`             | 내 프로필 수정 (닉네임/이미지/태그/직무/레벨) | O    | `/profile`, `/onboarding`        | 200      |
| DELETE | `/users/me`             | 회원 탈퇴 (soft delete)                       | O    | `/profile`                       | 204      |
| POST   | `/auth/email/send`      | 이메일 인증 코드 발송                         | X    | `/` (회원가입)                   | 200      |
| POST   | `/auth/email/verify`    | 인증 코드 검증                                | X    | `/` (회원가입)                   | 200      |

#### Epic A 상세 명세 (요청/응답 및 주요 플로우)

**1. 이메일 인증 (`POST /auth/email/send`, `POST /auth/email/verify`)**

- 발송 요청: `{"email": "..."}`
- 검증 요청: `{"email": "...", "code": "..."}` (code: 6자리 숫자 등)
- 플로우: 회원가입 진행 전 반드시 이메일로 인증 코드를 발송하고 검증을 완료해야 함. 검증 성공 후에만 `/auth/signup`을 호출할 수 있음.

**2. 이메일 회원가입 (`POST /auth/signup`)**

- 요청: `{"email": "...", "password": "...", "nickname": "..."}` (닉네임: 2~20자, 비밀번호: 8~20자, 영문+숫자+특수문자 필수)
- 응답(201):`{"success": true, "data": {"userId": "...", "email": "...", "nickname": "..."}, "message": "..."}`

**3. 이메일 로그인 (`POST /auth/login`)**

- 요청: `{"email": "...", "password": "..."}`
- 응답(200): `{"success": true, "data": {"accessToken": "...", "userId": "...", "email": "...", "nickname": "..."}, "message": "요청이 성공했습니다"}`
- 주의:
  - `refreshToken`은 응답 바디에 포함하지 않는다.
  - 백엔드가 `Set-Cookie` 헤더로 HttpOnly Cookie를 내려준다.
  - 프론트는 `accessToken`만 메모리(Zustand)에 저장한다.

**4. 로그아웃 (`POST /auth/logout`)**

- 요청: Header에 `Authorization: Bearer {access_token}` 포함
- 응답(200): `{"success": true, "data": null, "message": "요청이 성공했습니다"}`
- 플로우:
  - 백엔드는 Refresh Token Cookie를 만료 처리한다.
  - 프론트는 메모리에 저장한 Access Token 및 사용자 상태를 초기화한다.

**5. 토큰 재발급 (`POST /auth/refresh`)**

- 요청 바디 없음
- 브라우저가 HttpOnly Cookie(refreshToken)를 자동 첨부
- `fetch` 사용 시 `credentials: 'include'`
- `axios` 사용 시 `withCredentials: true`
- 응답(200): `{"success": true, "data": {"accessToken": "eyJhbGci...(새 토큰)"}, "message": "요청이 성공했습니다"}`
- 에러(401): `AUTH_003` (유효하지 않은 리프레시 토큰)

**중요 플로우 (Token Rotation)**

- 재발급 시 새 Refresh Token은 응답 바디가 아니라 `Set-Cookie` 헤더로 자동 갱신된다.
- 프론트는 응답의 새 `accessToken`으로 메모리 값을 교체한다.
- 리프레시 토큰은 프론트 코드에서 직접 읽거나 저장하지 않는다.

**6. 프로필 조회 및 수정 (`GET/PUT /users/me`)**

- `PUT` 요청 (선택적 필드): `{"nickname": "...", "profileImage": "...", "job": "BACKEND", "level": "MIDDLE", "tags": ["Spring", "Docker"]}`
- 제약사항: `job` (FRONTEND|BACKEND|FULLSTACK), `level` (BEGINNER|JUNIOR|MIDDLE|SENIOR), `nickname` (2~20자)

**_ GET /users/me 응답 예시 _**

```json
{
  "success": true,
  "data": {
    "userId": "uuid-1234",
    "email": "hong@devpick.kr",
    "nickname": "홍근",
    "profileImage": "https://...",
    "job": "BACKEND",
    "level": "JUNIOR",
    "tags": ["Spring", "Java"],
    "createdAt": "2026-02-24T09:00:00"
  },
  "message": "요청이 성공했습니다"
}
```

**_ PUT /users/me 요청 예시 _**

```json
{
  "nickname": "홍근2",
  "profileImage": "https://...",
  "job": "BACKEND",
  "level": "MIDDLE",
  "tags": ["Spring", "Docker"]
}
```

**_ PUT /users/me 응답 예시 _**

```json
{
  "success": true,
  "data": {
    "userId": "uuid-1234",
    "email": "hong@devpick.kr",
    "nickname": "홍근2",
    "profileImage": "https://...",
    "job": "BACKEND",
    "level": "MIDDLE",
    "tags": ["Spring", "Docker"],
    "createdAt": "2026-02-24T09:00:00"
  },
  "message": "요청이 성공했습니다"
}
```

**회원 탈퇴**

- DELETE /users/me
- 응답: 204 No Content

**7. 소셜 로그인 흐름 (GitHub: `DP-183`, Google: `DP-184`)**

### OAuth 시작 URL 발급

- 프론트는 GET /auth/github 또는 GET /auth/google을 먼저 호출한다.
- 백엔드는 OAuth state UUID를 생성하고 Redis에 5분 동안 저장한다.
- 응답으로 authorizationUrl을 반환한다.
- 프론트는 해당 URL로 브라우저를 이동시킨다.

### GitHub 시작 응답 예시

```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://github.com/login/oauth/authorize?client_id=xxx&redirect_uri=http://localhost:3000/auth/github/callback&scope=user:email&state=550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Google 시작 응답 예시

```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=xxx&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=email%20profile&state=550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 프론트 OAuth 처리 플로우

1. 로그인 화면에서 소셜 버튼 클릭
2. 프론트가 GET /auth/{provider} 호출
3. 응답의 authorizationUrl로 브라우저 이동
4. Provider 인증 완료 후 프론트 콜백 URL(/auth/github/callback, /auth/google/callback)로 리다이렉트
5. 프론트가 URL에서 code, state를 파싱
6. 프론트가 백엔드 콜백 API GET /auth/{provider}/callback?code={code}&state={state} 호출
7. 백엔드가 state 검증 후 Provider 토큰 교환 및 JWT 발급
8. 프론트가 응답의 accessToken을 메모리에 저장
9. isNewUser === true 이면 /onboarding으로 이동, 아니면 /home으로 이동

### 콜백 응답 예시 (Github/Google 공통)

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "nickname": "홍길동",
    "isNewUser": true
  }
}
```

### 소셜 로그인 규칙

- refreshToken은 응답 바디에 포함하지 않는다.
- 백엔드가 HttpOnly Cookie로 자동 설정한다.
- /users/me 추가 호출 없이 콜백 응답 데이터로 인증 상태를 초기화할 수 있다.
- isNewUser: true면 온보딩 페이지 이동
- isNewUser: false면 홈 피드 이동

### 닉네임 생성 규칙

- GitHub:
  - 중복 없으면 GitHub name 그대로 사용
  - 중복이면 login_providerId 형식 사용
  - 예: khg9859_12345678

- Google:
  - 중복 없으면 Google 프로필 이름 사용
  - 중복이면 emailPrefix_providerId 형식 사용
  - 예: hayoung_99999999

### OAuth 에러 코드

| 상황                       | HTTP | code       |
| -------------------------- | ---- | ---------- |
| state 없음 / 만료 / 불일치 | 400  | `AUTH_017` |
| GitHub API 실패            | 502  | `AUTH_013` |
| GitHub 이메일 비공개       | 400  | `AUTH_014` |
| Google API 실패            | 502  | `AUTH_015` |
| Google 이메일 없음         | 400  | `AUTH_016` |

### Epic B — 콘텐츠 피드

| Method | Endpoint                                | 설명                | 인증 | 관련 페이지           | 응답코드 |
| ------ | --------------------------------------- | ------------------- | ---- | --------------------- | -------- |
| GET    | `/contents`                             | 개인화 피드         | O    | `/home`               | 200      |
| GET    | `/contents/{contentId}`                 | 글 상세             | O    | `/home/[id]`          | 200      |
| GET    | `/contents/{contentId}/recommendations` | 글 상세 추천 콘텐츠 | O    | `/home/[id]`          | 200      |
| GET    | `/contents/search`                      | 글 검색             | O    | `/home`               | 200      |
| POST   | `/contents/{contentId}/scrap`           | 스크랩              | O    | `/home`, `/home/[id]` | 201      |
| DELETE | `/contents/{contentId}/scrap`           | 스크랩 취소         | O    | `/home`, `/home/[id]` | 204      |
| POST   | `/contents/{contentId}/like`            | 좋아요              | O    | `/home`, `/home/[id]` | 201      |
| DELETE | `/contents/{contentId}/like`            | 좋아요 취소         | O    | `/home`, `/home/[id]` | 204      |

#### [참고] 콘텐츠 피드 API 요청/응답 구조

**1. GET /contents (개인화 피드 조회)**

- 요청: `GET /contents?page=0&size=20` (기본값)
- 응답 (200 OK):

```json
{
  "success": true,
  "data": {
    "contents": [
      {
        "id": "uuid-5678",
        "title": "React useEffect 완전 정복",
        "author": "홍근",
        "sourceName": "Velog",
        "preview": "useEffect는 컴포넌트가 렌더링된 후...",
        "thumbnailUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        "canonicalUrl": "[https://velog.io/@hong/](https://velog.io/@hong/)...",
        "tags": ["React", "Frontend"],
        "publishedAt": "2026-02-24T09:00:00",
        "isScrapped": false,
        "isLiked": false
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  },
  "message": "피드를 불러왔습니다"
}
```

**2. GET /contents/{contentId} (글 상세 조회)**

- 응답 (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid-5678",
    "title": "React useEffect 완전 정복",
    "author": "홍근",
    "sourceName": "Velog",
    "preview": "useEffect는 컴포넌트가 렌더링된 후...",
    "thumbnailUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    "canonicalUrl": "[https://velog.io/@hong/](https://velog.io/@hong/)...",
    "originalContent": "전체 본문...",
    "isOriginalVisible": true,
    "licenseType": "CC BY",
    "publishedAt": "2026-02-24T09:00:00",
    "tags": ["React", "Frontend"],
    "isScrapped": false,
    "isLiked": false,
    "sourceName": "Velog"
  },
  "message": "요청이 성공했습니다"
}
```

**3. GET /contents/{contentId}/recommendations (글 상세 추천 콘텐츠)**

- 요청: `GET /contents/{contentId}/recommendations?size=5`
- 응답 (200 OK):

```json
{
  "success": true,
  "data": {
    "contents": [
      {
        "id": "uuid-9012",
        "title": "Next.js App Router 데이터 패칭 전략",
        "author": "김개발",
        "sourceName": "Velog",
        "preview": "App Router에서는 서버 컴포넌트에서 데이터를 패칭하고...",
        "thumbnailUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        "canonicalUrl": "https://velog.io/@dev/nextjs-app-router-data-fetching",
        "tags": ["Next.js", "React", "Frontend"],
        "publishedAt": "2026-03-10T12:30:00",
        "isScrapped": false,
        "isLiked": true
      }
    ],
    "page": 0,
    "size": 0,
    "totalElements": 0,
    "totalPages": 0
  },
  "error": {
    "code": "string",
    "message": "string",
    "detail": {}
  }
}
```

**4. GET /contents/search (글 검색)**

- 요청: `GET /contents/search?query=useEffect&tags=React&tags=Frontend&page=0&size=20`
- 응답 (200 OK):

```json
{
  "success": true,
  "data": {
    "contents": [
      {
        "id": "uuid-5678",
        "title": "React useEffect 완전 정복",
        "author": "홍근",
        "sourceName": "Velog",
        "preview": "useEffect는 컴포넌트가 렌더링된 후...",
        "thumbnailUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        "canonicalUrl": "[https://velog.io/@hong/](https://velog.io/@hong/)...",
        "tags": ["React", "Frontend"],
        "publishedAt": "2026-02-24T09:00:00",
        "isScrapped": false,
        "isLiked": false
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  },
  "message": "피드를 불러왔습니다"
}
```

### Epic C — AI 요약

> 데이터 구조는 API 응답 필드를 기준으로 사용한다.

| Method | Endpoint                              | 설명                | 인증 | 관련 페이지  | 응답코드 |
| ------ | ------------------------------------- | ------------------- | ---- | ------------ | -------- |
| GET    | `/contents/{contentId}/summary`       | 레벨별 AI 요약 조회 | O    | `/home/[id]` | 200      |
| POST   | `/contents/{contentId}/summary/retry` | AI 요약 재시도      | O    | `/home/[id]` | 200      |

**API 스펙 참고:**
GET /contents/{contentId}/summary
query param: level = BEGINNER | JUNIOR | MIDDLE | SENIOR (default JUNIOR)
Authorization: Bearer token

응답 데이터 shape:

```ts
{
  contentId: string;
  level: "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
  coreSummary: string;
  keyPoints: string[];
  keywords: string[];
  difficulty: string;
  nextRecommendation: string;
  confidence: number;
  additionalQuestions: string[];
  cachedAt: string;
  expiresAt: string;
}
```

**재시도 API 스펙 참고:**
POST /contents/{contentId}/summary/retry
설명: 캐시를 무시하고 FastAPI에서 새로 생성
query param:

- level: BEGINNER | JUNIOR | MIDDLE | SENIOR (default JUNIOR)
  Authorization: Bearer token

응답 데이터 shape:

```ts
  success: true,
  data: {
    contentId: string;
    level: "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";
    coreSummary: string;
    keyPoints: string[];
    keywords: string[];
    difficulty: string;
    nextRecommendation: string;
    confidence: number;
    additionalQuestions: string[];
    cachedAt: string;
    expiresAt: string;
  }
}
```

### Epic D — 질문/커뮤니티

| Method | Endpoint                                                  | 설명                           | 인증 | 관련 페이지        |
| ------ | --------------------------------------------------------- | ------------------------------ | ---- | ------------------ |
| POST   | `/posts`                                                  | 질문 작성 + 커뮤니티 동시 게시 | O    | `/community/write` |
| GET    | `/posts`                                                  | 게시글 목록                    | O    | `/community`       |
| GET    | `/posts/{postId}`                                         | 게시글 상세                    | O    | `/community/[id]`  |
| PUT    | `/posts/{postId}`                                         | 게시글 수정                    | O    | `/community/[id]`  |
| DELETE | `/posts/{postId}`                                         | 게시글 삭제                    | O    | `/community/[id]`  |
| POST   | `/posts/refine`                                           | AI 질문 개선                   | O    | `/community/write` |
| GET    | `/posts/{postId}/similar`                                 | 유사 질문 조회                 | O    | `/community/[id]`  |
| POST   | `/posts/{postId}/ai-answer`                               | AI 답변 생성                   | O    | `/community/[id]`  |
| POST   | `/posts/{postId}/answers`                                 | 답변 작성                      | O    | `/community/[id]`  |
| PUT    | `/posts/{postId}/answers/{answerId}`                      | 답변 수정                      | O    | `/community/[id]`  |
| DELETE | `/posts/{postId}/answers/{answerId}`                      | 답변 삭제                      | O    | `/community/[id]`  |
| POST   | `/posts/{postId}/answers/{answerId}/adopt`                | 답변 채택                      | O    | `/community/[id]`  |
| POST   | `/posts/{postId}/answers/{answerId}/comments`             | 댓글 작성                      | O    | `/community/[id]`  |
| DELETE | `/posts/{postId}/answers/{answerId}/comments/{commentId}` | 댓글 삭제                      | O    | `/community/[id]`  |

### Epic E — 학습 히스토리

| Method | Endpoint            | 설명                    | 인증 | 관련 페이지 |
| ------ | ------------------- | ----------------------- | ---- | ----------- |
| GET    | `/history`          | 학습 히스토리 조회      | O    | `/profile`  |
| GET    | `/history/activity` | 활동 내역 (좋아요 포함) | O    | `/profile`  |

### Epic F — 주간 리포트

| Method | Endpoint                     | 설명           | 인증 | 관련 페이지 |
| ------ | ---------------------------- | -------------- | ---- | ----------- |
| GET    | `/reports/weekly`            | 이번 주 리포트 | O    | `/report`   |
| GET    | `/reports/weekly/{reportId}` | 특정 주 리포트 | O    | `/report`   |
| POST   | `/reports/weekly/share`      | 공유 링크 생성 | O    | `/report`   |

---

## 9. 스프린트 진행 현황 — 프론트엔드

### 지난 스프린트: Sprint 0, 1 (완료)

| 티켓   | 작업                                                  |
| ------ | ----------------------------------------------------- |
| DP-138 | devpick-frontend 레포 생성 및 Next.js 프로젝트 초기화 |
| DP-141 | GitHub Actions CI 파이프라인 초안 세팅                |
| DP-155 | 피드형 웹 레퍼런스 수집                               |
| DP-157 | 전체 페이지 와이어프레임 초안 작성                    |
| DP-158 | 프론트엔드 라우팅 구조 설계 (페이지 URL 구조)         |
| DP-167 | PR 템플릿 추가                                        |
| DP-168 | 브랜치 보호 규칙 설정                                 |
| DP-169 | CLAUDE.md 각 레포에 작성                              |
| DP-190 | 프론트엔드 API 클라이언트 세팅 (axios 인터셉터 등)    |
| DP-191 | 프론트엔드 전역 상태 관리 세팅 (Zustand store 구조)   |
| DP-192 | 프론트엔드 공통 컴포넌트 개발 (버튼/카드/모달 등)     |
| DP-193 | 회원가입 화면 개발                                    |
| DP-194 | 로그인 화면 개발                                      |
| DP-195 | 프로필 설정 화면 개발 (태그/직무/레벨)                |
| DP-211 | 피드 화면 개발 (무한 스크롤)                          |
| DP-212 | 글 상세 화면 개발                                     |

### 현재 스프린트: Sprint 2 (3/16 ~ 3/22) — Epic C/D/E/F 핵심

| 티켓   | 작업                                                    |
| ------ | ------------------------------------------------------- |
| DP-224 | 글 상세 화면 AI 요약 섹션 개발                          |
| DP-225 | AI 요약 실패/지연 대체 화면 처리                        |
| DP-241 | 게시글 작성 화면 개발 (질문(왼쪽) + 바로 커뮤니티 게시) |
| DP-242 | AI 질문 개선 화면(오른쪽) 개발                          |
| DP-243 | AI 1차 답변 화면 개발 + 게시글 화면                     |
| DP-244 | 커뮤니티 화면 개발                                      |
| DP-251 | 학습 히스토리 화면 개발 (타임라인)                      |
| DP-261 | 주간 리포트 화면 개발 (바 차트/레이더 차트)             |
| DP-262 | AI 인사이트 화면 개발                                   |
| DP-263 | 리포트 저장/공유 화면 개발                              |

---

## 10. 테스트 전략

- **도구**:
  - 단위/컴포넌트: Jest + React Testing Library
  - E2E 테스트: Playwright
- **커버리지 목표**: 주요 화면 **60% 이상**
- **CI 트리거**: PR → develop 시 자동 실행
- **테스트 패턴**: given / when / then 구조

- 단위/컴포넌트 테스트 예시(Jest)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './login-form';

test('로그인 버튼 클릭 시 API 호출', () => {
    // given
    const mockApi = jest.fn();
    render(<LoginForm onSubmit={mockApi} />);

    // when
    fireEvent.click(screen.getByText('로그인'));

    // then
    expect(mockApi).toHaveBeenCalledTimes(1);
});
```

- E2E 테스트 예시 (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("사용자는 성공적으로 로그인할 수 있다", async ({ page }) => {
  // given
  await page.goto("/");

  // when
  await page.fill('input[name="email"]', "test@devpick.kr");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // then
  await expect(page).toHaveURL("/home");
});
```

---

## 11. 포트 정보 (로컬 개발)

| 서비스                       | 포트  |
| ---------------------------- | ----- |
| Next.js 프론트엔드 (이 서버) | 3000  |
| Spring Boot                  | 8080  |
| FastAPI AI 서버              | 8000  |
| PostgreSQL                   | 5432  |
| MongoDB                      | 27017 |
| Redis                        | 6379  |

---

## 12. 보안 주의사항

- `NEXT_PUBLIC_`이 붙은 변수, API Key, DB 비밀번호 등 시크릿은 **절대 코드에 하드코딩 금지**
- `.env.local` 파일은 `.gitignore`에 포함 (절대 push 금지)
- Access Token은 메모리(Zustand 등)에만 저장하고, localStorage/sessionStorage에 저장하지 않음
- Refresh Token은 HttpOnly Cookie로만 관리하며, 프론트 코드에서 직접 읽거나 저장하지 않음
- `/auth/refresh` 호출 시 `withCredentials: true` 또는 `credentials: 'include'`를 반드시 설정
- 레거시 토큰 저장 유틸 파일이 남아 있더라도, 실제 운영 기준은 Access Token 메모리 저장 + Refresh Token HttpOnly Cookie 관리 방식만 사용한다.
- AI 프롬프트에 개인정보/시크릿 절대 포함 금지
- Claude Code 사용 시 AI 생성 코드도 **PR 올린 사람이 책임**짐
- PR에 AI 사용 여부 반드시 기록

---

## 13. 참고 문서

| 문서                                  | 내용                |
| ------------------------------------- | ------------------- |
| `src/main/java/com/devpick/CLAUDE.md` | 도메인/DB 구조 상세 |
| `.env.example`                        | 환경변수 목록       |
| `.github/PULL_REQUEST_TEMPLATE.md`    | PR 작성 양식        |
| Confluence ADR                        | 기술 결정 기록      |

---

## 14. CI/CD 자동화 구조

### 전체 워크플로 (Claude Code 자동화)

```
/feature-dev DP-158 입력
→ Jira 티켓 자동 읽기 (제목/설명/AC) + In Progress 전환
→ feature/DP-158-routing-structure 브랜치 생성 (GitHub API)
→ AC 기반 Next.js 컴포넌트 작성 + 테스트 작성
→ PR 생성 (Jira 링크 자동 삽입 + AI 코드 리뷰)
→ PR에 'automerge' 라벨 부착 (자동 병합 트리거)
→ CI 실행: Lint + Build 테스트 (ci.yml)
→ CI 통과 및 라벨 확인 시 develop 자동 squash 머지 (automerge.yml) + Jira Done
```

### GitHub Actions 워크플로우

| 파일            | 트리거              | 역할                                                 |
| --------------- | ------------------- | ---------------------------------------------------- |
| `ci.yml`        | PR → develop        | ESLint 체크 · Next.js 빌드 성공 여부 검증            |
| `automerge.yml` | PR 라벨 (automerge) | CI 통과 및 라벨 존재 시 develop으로 자동 squash 머지 |

### 브랜치별 동작

| 브랜치                       | 생성 주체           | 머지 방식                           | 머지 조건                  |
| ---------------------------- | ------------------- | ----------------------------------- | -------------------------- |
| `feature/DP-{번호}-{기능명}` | Claude Code/ 개발자 | 자동 squash 머지                    | `automerge` 라벨 + CI 통과 |
| `feature/DP-{번호}-{기능명}` | 개발자 직접         | 라벨 없을 시 팀원 리뷰 후 직접 머지 |
| `hotfix/DP-{번호}-{설명}`    | 개발자 직접         | 긴급 버그 수정 및 수동 승인         |

### Claude Code 스킬 (`/feature-dev`)

```
# 사용법 예시
/feature-dev DP-158
```

자동으로 하는 것:

- Jira 연동: MCP를 통해 티켓의 제목, 상세 설명, 인수 조건(AC) 추출
- 상태 관리: Jira 티켓 상태를 To Do → In Progress → Done으로 자동 갱신
- `feature/DP-{번호}-{기능명}` 브랜치 생성
- 코드 생성: Next.js 16(App Router) 및 Tailwind 4 컨벤션에 맞는 코드 작성
- PR 자동화: PR 본문에 Jira 티켓 링크 포함 및 automerge 라벨 자동 추가
- PR diff 기반 코드 자동 리뷰
- 자동 머지 대기: ci.yml 통과 및 라벨 체크 후 자동 병합 프로세스 완료.

### 실제 워크플로 예시

```
1. Claude Code에서 입력: /feature-dev DP-158

2. 자동 실행:
   - Jira DP-158 읽기 → "Next.js 라우팅 구조 구현"
   - 티켓 상태 변경: To Do → In Progress
   - 브랜치 생성: feature/DP-158-routing-structure
   - Next.js 16 및 Tailwind 4 기반의 페이지/컴포넌트 작성
   - 컴포넌트 유닛 테스트 작성 및 로컬 검증
   - PR 생성 및 라벨링:
    - PR 제목: "[DP-158] Next.js 라우팅 구조 구현"
    - PR 본문: 작업 내용 요약, Jira 티켓 링크, AC 충족 여부 체크리스트 포함
   - 라벨 부착: 'automerge' 라벨 자동 추가 (자동 병합 트리거)

3. CI 자동 실행 (~5분):
   - GitHub Actions 실행: Lint 체크 → Type Check → Next.js Build 테스트

4. develop 자동 squash 머지
    - 'automerge' 라벨 확인 + CI Pass 확인 → develop으로 자동 병합

5. Jira DP-158 티켓 → Done 자동 전환
```
