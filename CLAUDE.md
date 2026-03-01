# DevPick Frontend - Claude Code Context

당신은 'DevPick' 프론트엔드 개발 전문가입니다. 이 문서를 바탕으로 프로젝트의 문맥을 이해하고 가이드라인을 준수하세요.

> **참고**: 이 문서는 프로젝트 전체의 아키텍처, 기술 스택, API 명세, 코드 컨벤션 및 CI/CD 전략을 정의하는 단일 진실 공급원(SSOT, Single Source of Truth)입니다.

---

## 1. 프로젝트 개요

**DevPick** — 개발자 성장형 통합 플랫폼

> 개발 콘텐츠 탐색 → AI 요약/질문 → 커뮤니티 소통 → 성장 기록/리포트를 하나의 흐름으로 연결

이 레포는 **Next.js (App Router) 기반 프론트엔드 웹 애플리케이션**이다.

- 프론트엔드 담당: **홍보민**
- MVP 데드라인: **2026-04-13**
- 현재 스프린트: Sprint 0 (2/24 ~ 3/2) — 환경 세팅 및 라우팅 구조 설계

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

## 3. 폴더 구조 (App Router + FSD 변형)

```
├── app/
│ ┣ community/           # 커뮤니티 피드 (질문/게시글 목록)
│ ┃ ┣ write/             # 커뮤니티 글쓰기 및 AI 질문 개선
│ ┃ ┃ ┗ page.tsx
│ ┃ ┣ [id]/              # 게시글 상세 및 AI/유저 답변
│ ┃ ┃ ┗ page.tsx
│ ┃ ┗ page.tsx
│ ┣ home/                # 맞춤형 아티클 피드 (메인)
│ ┃ ┣ [id]/              # 아티클 상세 및 AI 요약 뷰어
│ ┃ ┃ ┗ page.tsx
│ ┃ ┗ page.tsx
│ ┣ onboarding/          # 초기 사용자 성향 파악 온보딩
│ ┃ ┗ page.tsx
│ ┣ profile/             # 내 프로필, 스크랩, 활동 내역
│ ┃ ┗ page.tsx
│ ┣ report/              # 주간 학습 분석 리포트 대시보드
│ ┃ ┗ page.tsx
│ ┣ favicon.ico         # 파비콘
│ ┣ globals.css         # 전역 스타일 및 Tailwind CSS 설정
│ ┣ layout.tsx          # Root Layout (GNB, Footer, Provider 등 공통 레이아웃)
│ ┗ page.tsx            # 메인 랜딩 (로그인 페이지)
├── components/           # 공통 UI 컴포넌트 (버튼, 인풋, 모달 등)
├── lib/                  # 유틸리티 함수 (포맷팅, tailwind merge 등)
├── hooks/                # 공통 Custom Hooks
├── types/                # TypeScript 전역 타입 정의 (DTO 등)
└── public/               # 정적 에셋 (이미지, 폰트)
```

---

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

**Base URL**: `https://api.devpick.kr/v1`
**인증**: `Authorization: Bearer {access_token}`
**에러 처리**: 백엔드 공통 에러 포맷에 맞춰 클라이언트에서 토스트(Toast) 메시지 또는 에러 바운더리(Error Boundary)로 렌더링.

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

| 코드 | 의미         |
| ---- | ------------ |
| 200  | 성공         |
| 201  | 생성 성공    |
| 400  | 잘못된 요청  |
| 401  | 인증 필요    |
| 403  | 권한 없음    |
| 404  | 찾을 수 없음 |
| 500  | 서버 오류    |

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

| Method | Endpoint        | 설명                    | 인증 | 관련 페이지               |
| ------ | --------------- | ----------------------- | ---- | ------------------------- |
| POST   | `/auth/signup`  | 이메일 회원가입         | X    | `/` (로그인)              |
| POST   | `/auth/login`   | 이메일 로그인           | X    | `/` (로그인)              |
| POST   | `/auth/logout`  | 로그아웃                | O    | Global (GNB)              |
| POST   | `/auth/refresh` | Access Token 재발급     | X    | Axios Interceptor         |
| GET    | `/auth/github`  | GitHub 소셜 로그인      | X    | `/` (로그인)              |
| GET    | `/auth/google`  | Google 소셜 로그인      | X    | `/` (로그인)              |
| GET    | `/users/me`     | 내 프로필 조회          | O    | `/profile`, `/onboarding` |
| PUT    | `/users/me`     | 내 프로필 수정          | O    | `/profile`, `/onboarding` |
| DELETE | `/users/me`     | 회원 탈퇴 (soft delete) | O    | `/profile`                |

### Epic B — 콘텐츠 피드

| Method | Endpoint                      | 설명                            | 인증 | 관련 페이지           |
| ------ | ----------------------------- | ------------------------------- | ---- | --------------------- |
| GET    | `/contents`                   | 개인화 피드 (`?page=0&size=10`) | O    | `/home`               |
| GET    | `/contents/{contentId}`       | 글 상세                         | O    | `/home/[id]`          |
| GET    | `/contents/search`            | 글 검색                         | O    | `/home` (검색 모달)   |
| POST   | `/contents/{contentId}/scrap` | 스크랩                          | O    | `/home`, `/home/[id]` |
| DELETE | `/contents/{contentId}/scrap` | 스크랩 취소                     | O    | `/home`, `/home/[id]` |
| POST   | `/contents/{contentId}/like`  | 좋아요                          | O    | `/home`, `/home/[id]` |
| DELETE | `/contents/{contentId}/like`  | 좋아요 취소                     | O    | `/home`, `/home/[id]` |

### Epic C — AI 요약

| Method | Endpoint                              | 설명 | 인증         | 관련 페이지 |
| ------ | ------------------------------------- | ---- | ------------ | ----------- |
| GET    | `/contents/{contentId}/summary`       | O    | `/home/[id]` |
| POST   | `/contents/{contentId}/summary/retry` | O    | `/home/[id]` |

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

## 9. 현재 스프린트 — 프론트엔드 작업 (Sprint 0)

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

### Sprint 1 (3/3 ~ 3/16) — Epic A/B 핵심

| 티켓   | 작업                                                |
| ------ | --------------------------------------------------- |
| DP-190 | 프론트엔드 API 클라이언트 세팅 (axios 인터셉터 등)  |
| DP-191 | 프론트엔드 전역 상태 관리 세팅 (Zustand store 구조) |
| DP-192 | 프론트엔드 공통 컴포넌트 개발 (버튼/카드/모달 등)   |
| DP-193 | 회원가입 화면 개발                                  |
| DP-194 | 로그인 화면 개발                                    |
| DP-195 | 프로필 설정 화면 개발 (태그/직무/레벨)              |
| DP-211 | 피드 화면 개발 (무한 스크롤)                        |
| DP-212 | 글 상세 화면 개발                                   |

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
  await page.goto("/login");

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
- API 토큰 관리는 HttpOnly Cookie 또는 보안이 적용된 클라이언트 스토리지 전략을 따름
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
