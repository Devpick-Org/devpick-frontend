# DP-495 구현 계획 — Free / Pro / Max 구독 플랜

## 개요

- **Epic**: DP-495
- **작성일**: 2026-05-20
- **참고 파일**: `DP-495_final_api_spec.json`, `DP-495_feature_changes.json`, `DP-495_frontend_guide.txt`, `plan.png`, `money.png`

### 티켓 목록

| 티켓   | Phase | 제목                                                      |
| ------ | ----- | --------------------------------------------------------- |
| DP-502 | 1     | 구독 플랜 기반 작업 (타입·API·인터셉터·패키지)            |
| DP-503 | 2     | 플랜 소개 페이지 + TopNav 구독 메뉴 추가                  |
| DP-504 | 3     | 토스페이먼츠 결제 플로우 구현                             |
| DP-505 | 4     | PlanUpgradeModal · LimitExceededModal 공통 모달           |
| DP-506 | 5     | 프로필 페이지 구독 관리 섹션                              |
| DP-507 | 6     | 기존 페이지 플랜 제한 UI (홈·AI요약·AI퀴즈·글쓰기·리포트) |
| DP-508 | 7     | 채용 기능 사용량 제한 UI (부족역량보완·면접Q&A·모의면접)  |
| DP-509 | 8     | 구독 API 실제 연동 (mock → axios 교체)                    |

---

## Mock 데이터 전략

백엔드 API가 아직 미완성 상태이므로 아래 방식으로 진행한다.

| 항목                                         | 방식                                                                    |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| 구독 API 3개 (billingAuth, 해지, 환불)       | `lib/mock/subscriptions.ts` mock 반환                                   |
| `/users/me` 신규 필드 (planType, limits 등)  | 백 연동 시 자동 반영. 그 전까지 `undefined` 방어 처리                   |
| `planLimited`, `locked` 필드 (기존 API 변경) | 동일하게 방어 처리                                                      |
| 토스페이먼츠 결제위젯                        | 실제 SDK 연동. `NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...` 테스트 키 사용 |
| UI / 페이지 / 컴포넌트                       | 전부 실제 구현                                                          |

**DP-509에서 할 일**: `lib/api/endpoints/subscriptions.ts` 의 mock 반환 3개를 실제 axios 호출로 교체하고 `lib/mock/subscriptions.ts` 제거.

---

## 의존 관계

```
DP-502 / Phase 1 (기반)
  ├─ DP-503 / Phase 2 (플랜 페이지 + TopNav)   ← DP-504와 병렬 가능
  ├─ DP-504 / Phase 3 (결제 플로우)             ← DP-503과 병렬 가능
  ├─ DP-505 / Phase 4 (공통 모달)
  │     ├─ DP-506 / Phase 5 (프로필 구독 섹션)
  │     ├─ DP-507 / Phase 6 (기존 페이지 제한 UI)
  │     └─ DP-508 / Phase 7 (채용 limits UI)
  └─ DP-509 / Phase 8 (API 실제 연동)  ← 백엔드 완료 후
```

---

## Phase 1 — 기반 작업 `DP-502`

> 모든 Phase의 선행 조건. 가장 먼저 완료해야 한다.

### 작업 목록

| 작업                                            | 파일                                        | 비고                                                        |
| ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `@tosspayments/tosspayments-sdk` 설치           | `package.json`                              | 구버전 `payment-widget` 아님 주의                           |
| `LimitInfo`, `UserLimits`, `PlanType` 타입 정의 | `types/subscription.ts` (신규)              |                                                             |
| `User` 타입에 플랜 필드 추가                    | `types/auth.ts`                             | planType, planExpiredAt, lastBilledAt, limits 모두 optional |
| 피드 타입에 `planLimited` 필드 추가             | `types/content.ts`                          | `planLimited?: boolean` — FREE 유저 50개 한도 도달 시 true  |
| 리포트 목록 타입에 `locked` 필드 추가           | `types/report.ts`                           | `locked?: boolean` — FREE 유저 이전 주 항목에 true          |
| mock 시나리오 상수                              | `lib/mock/subscriptions.ts` (신규)          | FREE / PRO / MAX 3가지 시나리오 + limits 샘플값             |
| 구독 API 함수 3개 (mock 반환)                   | `lib/api/endpoints/subscriptions.ts` (신규) | billingAuth, cancelSubscription, refundSubscription         |
| Axios 인터셉터 에러 분기 추가                   | `lib/api/client.ts`                         | PAYMENT_001 ~ 005 처리                                      |
| 모달 트리거 상태 추가                           | `store/ui.store.ts`                         | planUpgradeModal, limitExceededModal — 기존 Toast 패턴 동일 |

### 타입 설계 참고

```typescript
// types/subscription.ts
export type PlanType = "FREE" | "PRO" | "MAX";

export interface LimitInfo {
  used: number;
  max: number; // -1 = 무제한
  remaining: number; // -1 = 무제한
  resetsAt: string | null; // ISO 8601 UTC. MAX 플랜은 null
}

export interface UserLimits {
  aiDaily: LimitInfo;
  skillBoostWeekly: LimitInfo;
  interviewQaGenerateWeekly: LimitInfo;
  mockInterviewWeekly: LimitInfo;
}
```

```typescript
// types/auth.ts User 인터페이스에 추가할 필드
planType?: PlanType;
planExpiredAt?: string | null;   // ISO 8601 UTC. 해지 예정 시 마지막 유효일, 정기 갱신 중이면 null
lastBilledAt?: string | null;    // ISO 8601 UTC. FREE 유저는 null
limits?: UserLimits;
```

### 인터셉터 에러 처리 규칙

| 에러 코드   | HTTP | 처리 방식                                                                                           |
| ----------- | ---- | --------------------------------------------------------------------------------------------------- |
| PAYMENT_001 | 409  | 토스트 "이미 구독 중입니다"                                                                         |
| PAYMENT_002 | 500  | `/payment/fail` 페이지 이동                                                                         |
| PAYMENT_003 | 403  | ui.store에 planUpgradeModal 상태 올림 (detail.requiredPlan 포함)                                    |
| PAYMENT_004 | 404  | 토스트 "구독 정보를 찾을 수 없습니다"                                                               |
| PAYMENT_005 | 429  | ui.store에 limitExceededModal 상태 올림 (detail.feature, detail.resetsAt, detail.requiredPlan 포함) |

---

## Phase 2 — 플랜 소개 페이지 + TopNav `DP-503`

> DP-502 완료 후 진행. DP-504와 병렬 가능.

### 작업 목록

| 작업                          | 파일                                                   | 비고                    |
| ----------------------------- | ------------------------------------------------------ | ----------------------- |
| 플랜 비교 페이지              | `app/(main)/plans/page.tsx` (신규)                     | `plan.png` 기반 디자인  |
| 플랜 카드 컴포넌트            | `components/features/subscription/PlanCard.tsx` (신규) | Free / Pro / Max 카드   |
| TopNav 드롭다운에 "구독" 추가 | `components/layout/TopNavVariant.tsx`                  | 프로필 아이템 바로 아래 |

### 플랜 소개 페이지 스펙

- Free / Pro / Max 3단 비교 카드 (`plan.png` 참고)
- 비로그인 유저도 접근 가능
- 로그인 유저는 현재 플랜 강조 표시 (`user?.planType`, undefined면 FREE 취급)
- 업그레이드 버튼 클릭 → `/payment/billing?plan=PRO` 또는 `/payment/billing?plan=MAX`

### 기능 비교표 항목 (`money.png` 기준 — 이 순서대로 표시)

| 기능                           | Free        | Pro       | Max       |
| ------------------------------ | ----------- | --------- | --------- |
| 홈 제공 글 수                  | 최신 50개   | 무제한    | 무제한    |
| AI 요약 / 퀴즈                 | 자신 레벨만 | 전 레벨   | 전 레벨   |
| AI 질문 개선 / 답변            | 일 5회      | 일 10회   | 무제한    |
| 리포트                         | 최근 1주만  | 누적 제공 | 누적 제공 |
| 히스토리 조회                  | 무제한      | 무제한    | 무제한    |
| 채용 공고 목록/상세            | 무제한      | 무제한    | 무제한    |
| 스킬갭 분석 (= 부족 역량 보완) | 주 2회      | 주 7회    | 무제한    |
| 면접 Q&A 조회                  | 무제한      | 무제한    | 무제한    |
| 면접 Q&A 생성                  | 주 2회      | 주 7회    | 무제한    |
| 모의 면접                      | 주 2회      | 주 7회    | 무제한    |

### 요금표

| 플랜 | 가격        |
| ---- | ----------- |
| Free | 무료        |
| Pro  | 월 9,900원  |
| Max  | 월 19,900원 |

---

## Phase 3 — 결제 플로우 `DP-504`

> DP-502 완료 후 진행. DP-503과 병렬 가능.

### 작업 목록

| 작업                         | 파일                                         | 비고                                                       |
| ---------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| 카드 등록 페이지 (토스 위젯) | `app/(main)/payment/billing/page.tsx` (신규) | `?plan=PRO\|MAX` 쿼리 파라미터 수신                        |
| 결제 완료 페이지             | `app/(main)/payment/success/page.tsx` (신규) | 토스 successUrl 콜백                                       |
| 결제 실패 페이지             | `app/(main)/payment/fail/page.tsx` (신규)    | 토스 failUrl 콜백                                          |
| 환경변수 추가                | `.env.local`                                 | `NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...` 값은 백에게 받기 |

### 결제 플로우 상세

```
1. /payment/billing?plan=PRO 진입
2. customerKey = crypto.randomUUID() 생성 (결제 요청 시점에 생성, 저장 불필요)
3. const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY)  — async 초기화 (await 필수)
4. const billing = tossPayments.billing({ customerKey })  — customerKey를 Toss SDK에 전달
5. billing.requestBillingAuth({
     method: "CARD",
     successUrl: `${window.location.origin}/payment/success?plan=${planType}`,
     failUrl: `${window.location.origin}/payment/fail?plan=${planType}`,
     customerEmail: user.email,    // useAuthStore
     customerName: user.nickname,  // useAuthStore
   }) 호출
6. 토스가 /payment/success?plan=PRO&authKey=auth_xxx&customerKey=uuid 로 리다이렉트
   (billing({ customerKey })에 전달한 customerKey를 토스가 successUrl에 그대로 붙여줌)
7. success 페이지에서 query params 읽기:
   - authKey     → searchParams.get('authKey')      // 토스가 붙여줌
   - customerKey → searchParams.get('customerKey')  // 토스가 붙여줌 (sessionStorage 불필요)
   - planType    → searchParams.get('plan')          // 미리 넣어둔 것
8. POST /subscriptions/billing-auth { authKey, customerKey, planType } 호출
   (mock → DP-509에서 실제 연동)
9. GET /users/me 재호출 → planType 갱신
10. "홈으로 이동" 버튼
```

### 결제 완료 페이지 스펙

- "Pro 플랜이 시작됐습니다!" 완료 메시지 (planType에 따라 동적)
- GET /users/me 재호출하여 store의 user 갱신
- "홈으로 이동" 버튼

### 결제 실패 페이지 스펙

- 실패 사유 안내
- "다시 시도" 버튼 → `/payment/billing?plan=...` (failUrl query param `plan`에서 planType 읽기)
- "나중에" 버튼 → `/home`

---

## Phase 4 — 공통 모달 2개 `DP-505`

> DP-502 완료 후 진행. DP-506·507·508의 선행 조건.

### 작업 목록

| 작업                 | 파일                                                             | 비고                     |
| -------------------- | ---------------------------------------------------------------- | ------------------------ |
| 업그레이드 유도 모달 | `components/features/subscription/PlanUpgradeModal.tsx` (신규)   |                          |
| 한도 초과 모달       | `components/features/subscription/LimitExceededModal.tsx` (신규) |                          |
| 모달 렌더링 위치     | `app/(main)/layout.tsx`                                          | ui.store 구독해서 렌더링 |

### PlanUpgradeModal 스펙

- 트리거: 인터셉터의 403 PAYMENT_003 또는 잠긴 항목 직접 클릭
- `requiredPlan === 'PRO'` → "이 기능은 Pro 이상 플랜에서 사용할 수 있어요"
- `requiredPlan === 'MAX'` → "이 기능은 Max 플랜에서만 사용할 수 있어요"
- 버튼: requiredPlan에 맞는 업그레이드 버튼 + 닫기

### LimitExceededModal 스펙

- 트리거: 인터셉터의 429 PAYMENT_005
- `detail.feature` 기반 어떤 기능인지 표시 — 백엔드 확정 키값 매핑:

  | feature 키 (서버 응답값)    | 표시 문구      | 리셋 주기                 |
  | --------------------------- | -------------- | ------------------------- |
  | `aiDaily`                   | AI 질문/답변   | 일 (매일 자정)            |
  | `skillBoostWeekly`          | 부족 역량 보완 | 주 (매주 월요일 자정 UTC) |
  | `interviewQaGenerateWeekly` | 면접 Q&A 생성  | 주 (매주 월요일 자정 UTC) |
  | `mockInterviewWeekly`       | 모의 면접      | 주 (매주 월요일 자정 UTC) |

- `detail.resetsAt` 기반 초기화 시각 표시 (로컬 시간 변환, "내일 자정" / "다음 월요일" 등 상대 표현)
- `detail.requiredPlan` 기반 업그레이드 버튼
- 닫기 버튼

---

## Phase 5 — 프로필 페이지 구독 관리 섹션 `DP-506`

> DP-505 완료 후 진행.

### 작업 목록

| 작업                    | 파일                                                         | 비고 |
| ----------------------- | ------------------------------------------------------------ | ---- |
| 구독 관리 섹션 컴포넌트 | `components/features/profile/SubscriptionSection.tsx` (신규) |      |
| 프로필 페이지에 통합    | `app/(main)/profile/page.tsx` 또는 기존 profile 컴포넌트     |      |

### 3가지 상태 분기

**상태 A — planType === 'FREE'**

- "현재 플랜: 무료"
- [Pro로 업그레이드] / [Max로 업그레이드] 버튼 → `/plans`

**상태 B — PRO 또는 MAX, planExpiredAt === null (정기 갱신 중)**

- "현재 플랜: Pro / Max — 정기 결제 중"
- [구독 해지] 버튼 → `DELETE /subscriptions` 호출
  - 성공 시 "N월 N일까지 이용 가능합니다" 토스트 후 상태 C로 전환
- [환불 요청] 버튼 — 표시 조건: `lastBilledAt !== null && 현재시각 < new Date(lastBilledAt) + 7일`
  - ※ 7일 체크는 **프론트에서만** 버튼 노출 제어. 백엔드는 별도 기간 검증 없음 (최종 스펙 명시)
  - `POST /subscriptions/cancel` 호출
  - 성공 시 "환불이 완료됐습니다. 즉시 Free 플랜으로 전환됩니다" 토스트

**상태 C — PRO 또는 MAX, planExpiredAt !== null (해지 예정)**

- "현재 플랜: Pro / Max — N월 N일까지 이용 가능 (해지 예정)"
- 남은 기간 표시
- [다시 구독하기] 버튼 → `/plans`

---

## Phase 6 — 기존 페이지 플랜 제한 UI `DP-507`

> DP-505 완료 후 진행.

### 작업 목록

| 기능                    | 변경 파일                                           | 작업 내용                                                                             |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 홈 피드                 | `app/(main)/home/page.tsx`                          | `planLimited: true` 시 피드 하단 업그레이드 배너                                      |
| AI 요약 레벨 잠금       | `components/features/home/AiSummary.tsx`            | FREE 유저 본인 레벨 외 🔒, 클릭 시 PlanUpgradeModal                                   |
| AI 퀴즈 레벨 잠금       | `components/features/home/quiz/QuizIntro.tsx`       | 동일 패턴                                                                             |
| AI 질문 개선 남은 횟수  | `components/features/community/PostRefinePanel.tsx` | `limits.aiDaily.remaining` 표시, 0이면 버튼 비활성화 + resetsAt 표시, -1이면 "무제한" |
| AI 답변 남은 횟수       | `components/features/community/AiAnswerSection.tsx` | `limits.aiDaily.remaining` 표시 (aiDaily는 질문 개선과 합산 카운트)                   |
| 커뮤니티 글쓰기 AI 팝업 | `components/features/community/PostWriteForm.tsx`   | 자동 AI 답변 → 팝업 선택 방식으로 변경                                                |
| 주간 리포트 잠금        | `components/features/report/WeeklyReportPage.tsx`   | `locked: true` 항목 🔒 + 회색 처리                                                    |

### 공통 규칙

- **limits 최신화**: `limits.aiDaily`를 표시하는 기능(AI 질문 개선, AI 답변, 커뮤니티 글쓰기 팝업)은 API 호출 성공 후 `GET /users/me` 재호출하여 `limits` 갱신 (TanStack Query `invalidateQueries` 활용)
- 페이지 진입 시 `/users/me`가 최신 상태여야 하므로 캐시 staleTime 설정 주의

### 홈 피드 배너 스펙

- `planLimited: true` 이면 피드 맨 아래 배너 표시
- 배너 내용: "50개까지만 볼 수 있어요. Pro로 업그레이드하면 무제한으로 확인할 수 있습니다."
- 배너에 "업그레이드" 버튼 → `/plans`
- 백 연동 전: `planLimited` 필드 없음 → 배너 미표시 (방어 처리로 자동 처리됨)

### AI 요약 / AI 퀴즈 레벨 잠금 스펙

- `user?.planType === 'FREE'` 이면 본인 레벨(`user?.level`) 외 탭에 🔒
- 잠긴 탭 클릭 시 API 호출 없이 바로 PlanUpgradeModal 표시 (`requiredPlan: 'PRO'`)
- PRO / MAX 유저는 모든 레벨 탭 활성화

### 커뮤니티 글쓰기 AI 답변 팝업 스펙

- **현재**: 기술 질문 게시 시 자동으로 AI 답변 생성
- **변경 — FREE / PRO**: "게시하기" 클릭 시 팝업
  - "AI 답변을 함께 생성할까요?"
  - 남은 횟수 표시 (`limits.aiDaily.remaining`)
  - [AI 답변 포함해서 게시] — POST /posts 후 POST /posts/{postId}/ai-answer 추가 호출
  - [그냥 게시] — POST /posts 만 호출
  - remaining === 0이면 AI 답변 버튼 비활성화 + `resetsAt` 표시
- **변경 — MAX**: 팝업 없이 즉시 게시 + AI 답변 자동 생성 (로딩 스피너만 표시)
- 커리어 질문은 변경 없음 (AI 답변 없음)

### 주간 리포트 잠금 스펙

- 목록 응답 스키마: `{ reportId, weekStart, weekEnd, status: string, locked: boolean }`
- `locked: true` 항목: 🔒 아이콘 + 회색 처리, 클릭 시 PlanUpgradeModal (API 호출 없이)
- `locked: false` 항목: 정상 클릭 가능
- 백 연동 전: `locked` 필드 없음 → 전부 클릭 가능 (방어 처리)

---

## Phase 7 — 채용 기능 limits UI `DP-508`

> DP-505 완료 후 진행.

### 작업 목록

| 기능           | 변경 파일                                                 | limits 키                   | 확정 엔드포인트                                                                        |
| -------------- | --------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| 부족 역량 보완 | `components/features/jobs/detail/JobSkillGapSection.tsx`  | `skillBoostWeekly`          | `POST /jobs/{jobId}/skill-gap`                                                         |
| 면접 Q&A 생성  | `components/features/jobs/detail/JobQASection.tsx`        | `interviewQaGenerateWeekly` | `POST /jobs/{jobId}/interview-qa/generate`                                             |
| 모의 면접 시작 | `components/features/jobs/detail/JobMockInterviewCta.tsx` | `mockInterviewWeekly`       | `POST /jobs/mock-interviews/start/job/{jobId}` 또는 `POST /jobs/mock-interviews/start` |

### 공통 limits UI 패턴

```
remaining > 0    → 버튼 활성화 + "이번 주 N회 남음" 표시
remaining === 0  → 버튼 비활성화 + "이번 주 횟수를 모두 사용했어요. N월 N일 초기화" 표시
remaining === -1 → 버튼 활성화 + "무제한" 표시
```

- `resetsAt` → 로컬 시간대 변환 + 상대 표현 ("내일 자정", "다음 월요일" 등)
- ※ MAX 플랜은 `resetsAt: null` 내려옴 → null 체크 필수. `remaining === -1`이면 날짜 포맷 시도 없이 "무제한"만 표시
- API 호출 시 429 PAYMENT_005 수신 → 인터셉터가 LimitExceededModal 표시
- **limits 최신화**: 각 기능 API 호출 성공 후 `GET /users/me` 재호출하여 `limits` 갱신 (TanStack Query `invalidateQueries` 활용)

---

## Phase 8 — 구독 API 실제 연동 `DP-509`

> 백엔드 API 완료 확인 후 진행. 나머지 Phase와 무관하게 독립적으로 진행 가능.

### 작업 목록

| 작업                                 | 파일                                 | 비고                                              |
| ------------------------------------ | ------------------------------------ | ------------------------------------------------- |
| billingAuth mock → axios 교체        | `lib/api/endpoints/subscriptions.ts` | `POST /subscriptions/billing-auth`                |
| cancelSubscription mock → axios 교체 | `lib/api/endpoints/subscriptions.ts` | `DELETE /subscriptions`                           |
| refundSubscription mock → axios 교체 | `lib/api/endpoints/subscriptions.ts` | `POST /subscriptions/cancel`                      |
| mock 파일 삭제                       | `lib/mock/subscriptions.ts`          |                                                   |
| 운영 환경변수 교체                   | `.env.local` 및 배포 환경변수        | `NEXT_PUBLIC_TOSS_CLIENT_KEY` 실제 운영 키로 교체 |

### 연동 후 검증 체크리스트

- [ ] `POST /subscriptions/billing-auth` — 결제 성공 후 planType 갱신 확인
- [ ] `DELETE /subscriptions` — 해지 후 planExpiredAt 값 수신 확인
- [ ] `POST /subscriptions/cancel` — 환불 후 planType FREE 전환 확인
- [ ] `/users/me` 응답에 `planType`, `planExpiredAt`, `lastBilledAt`, `limits` 포함 확인
- [ ] `/contents` 응답에 `planLimited` 필드 포함 확인 (FREE 유저 50개 도달 시)
- [ ] `/reports/weekly/list` 응답에 `locked` 필드 포함 확인 (FREE 유저)

---

## 플랜별 기능 한도 요약

| 기능                              | FREE        | PRO     | MAX     |
| --------------------------------- | ----------- | ------- | ------- |
| 홈 피드                           | 최신 50개   | 무제한  | 무제한  |
| AI 요약 레벨                      | 본인 레벨만 | 전 레벨 | 전 레벨 |
| AI 퀴즈 레벨                      | 본인 레벨만 | 전 레벨 | 전 레벨 |
| AI 질문 개선 + AI 답변 (합산, 일) | 5회         | 10회    | 무제한  |
| 주간 리포트                       | 최근 1주    | 전체    | 전체    |
| 부족 역량 보완 (주)               | 2회         | 7회     | 무제한  |
| 면접 Q&A 생성 (주)                | 2회         | 7회     | 무제한  |
| 모의 면접 (주)                    | 2회         | 7회     | 무제한  |
| 면접 Q&A 조회                     | 무제한      | 무제한  | 무제한  |
