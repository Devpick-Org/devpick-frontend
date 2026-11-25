# devpick-frontend

> Trace 개발자 성장 플랫폼의 Next.js 프론트엔드 웹 애플리케이션입니다.
> 전체 프로젝트 소개는 [Devpick-Org](https://github.com/Devpick-Org) 에서 확인할 수 있습니다.

---

## 기술 스택

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![TossPayments](https://img.shields.io/badge/TossPayments-0064FF?style=for-the-badge&logo=tosspayments&logoColor=white)

| 구분            | 기술                      |
| --------------- | ------------------------- |
| 언어            | TypeScript                |
| 프레임워크      | Next.js 16.x (App Router) |
| UI 라이브러리   | React 19                  |
| 스타일링        | Tailwind CSS 4.x          |
| 클라이언트 상태 | Zustand                   |
| 서버 상태       | TanStack Query v5         |
| HTTP 클라이언트 | Axios                     |
| 데이터 시각화   | Recharts                  |
| 마크다운 렌더링 | react-markdown            |
| 아이콘          | Lucide React              |
| 패키지 매니저   | npm                       |
| 린트/포맷팅     | ESLint + Prettier         |
| 에러 모니터링   | Sentry                    |
| CI/CD           | GitHub Actions            |
| 결제            | TossPayments SDK          |

---

## 시스템 구조

```mermaid
flowchart LR
    Browser[Browser]
    Nginx[Nginx with TLS]
    Front[Next.js port 3000]
    Api[Spring Boot port 8080]
    Pg[PostgreSQL on RDS]
    Redis[Redis on ElastiCache]
    Ai[FastAPI AI port 8000]
    Sentry[Sentry]

    Browser --> Nginx
    Nginx --> Front
    Nginx --> Api
    Api --> Pg
    Api --> Redis
    Api --> Ai
    Front -. errors .-> Sentry
    Api -. errors .-> Sentry
```

```
브라우저
  └─ Nginx, TLS
       ├─ Next.js 프론트엔드 port 3000  ← 이 레포
       └─ Spring Boot API 서버 port 8080
              ├─ PostgreSQL on AWS RDS port 5432
              ├─ Redis on AWS ElastiCache port 6379
              ├─ DynamoDB on AWS
              ├─ AWS S3 파일 저장소
              ├─ FastAPI AI 서버 port 8000
              ├─ Sentry 에러 추적과 트레이싱
              └─ Prometheus, Grafana, Loki, Promtail 모니터링
```

---

## 프로젝트 구조

```
devpick-frontend
├── app/
│   ├── (auth)/              # Route Group — GNB 없는 레이아웃 (랜딩 페이지)
│   ├── (main)/              # Route Group — GNB 있는 레이아웃
│   │   ├── home/            # 콘텐츠 피드, 글 상세, AI 퀴즈
│   │   ├── community/       # 커뮤니티 피드, 게시글 작성·상세
│   │   ├── history/         # 학습 히스토리 (학습·활동·배지 탭)
│   │   ├── profile/         # 내 프로필 설정
│   │   ├── report/          # 주간 학습 분석 리포트
│   │   ├── trends/          # 개발 생태계 트렌드
│   │   ├── plans/           # 구독 플랜 소개 (Free·Pro·Max)
│   │   └── payment/         # 결제 플로우 (billing·success·fail)
│   ├── auth/                # OAuth 콜백 라우트 (GitHub·Google)
│   ├── onboarding/          # 초기 사용자 성향 파악
│   └── report/share/        # 공유 리포트 (비로그인 접근 가능)
├── components/
│   ├── ui/                  # 재사용 프리미티브 (shadcn/ui 기반)
│   ├── layout/              # GNB, 탭바 등 레이아웃 컴포넌트
│   └── features/            # 도메인별 기능 컴포넌트
│       ├── auth/            # 로그인·회원가입·OAuth 콜백
│       ├── home/            # 피드 카드, AI 요약, 퀴즈
│       ├── community/       # 게시글, 답변, AI 답변
│       ├── history/         # 타임라인, 배지, 포인트
│       ├── profile/         # 프로필 수정 폼
│       ├── report/          # 주간 리포트, 공유 리포트
│       ├── trends/          # 트렌드 키워드 시각화
│       ├── jobs/            # 채용 공고 목록·상세
│       ├── resume/          # 이력서 관리
│       ├── subscription/    # 구독 모달, 플랜 카드
│       └── landing/         # 랜딩 페이지
├── lib/
│   ├── api/                 # Axios 인스턴스, 도메인별 API 함수
│   ├── auth/                # 토큰 관리 (Access: Zustand, Refresh: HttpOnly Cookie)
│   └── mock/                # 개발용 목 데이터
├── store/                   # Zustand 전역 상태 (auth, content, ui)
└── types/                   # TypeScript 전역 타입 정의
```

---

## 주요 기능


<table>
  <tr>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/content-ai.gif" alt="기술 콘텐츠 수집과 AI 요약" width="100%" />
      <br />
      <strong>기술 콘텐츠 수집과 AI 요약</strong>
      <br />
      <sub>여러 출처 수집, 정규화, 레벨별 AI 요약과 질의응답</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/quiz.gif" alt="난이도별 AI 퀴즈" width="100%" />
      <br />
      <strong>난이도별 AI 퀴즈</strong>
      <br />
      <sub>콘텐츠 이해도를 단계별 문제로 점검하고 학습 흐름을 이어감</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/community.gif" alt="커뮤니티 질문 AI 개선과 AI 1차 답변" width="100%" />
      <br />
      <strong>커뮤니티 질문 AI 개선과 AI 1차 답변</strong>
      <br />
      <sub>기술과 커리어 질문을 AI로 다듬고 첫 답변을 빠르게 제공</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/job.gif" alt="채용 공고 매칭" width="100%" />
      <br />
      <strong>채용 공고 매칭</strong>
      <br />
      <sub>이력서 기술 스택과 채용 공고를 비교해 매칭도를 계산</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/resume.gif" alt="이력서 관리와 면접 QA 역량 보완" width="100%" />
      <br />
      <strong>이력서 관리와 면접 QA 역량 보완</strong>
      <br />
      <sub>이력서 분석, 면접 Q&A, 부족 역량 추천을 취업 준비로 연결</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/mock-interview.gif" alt="모의면접" width="100%" />
      <br />
      <strong>모의면접</strong>
      <br />
      <sub>직무와 이력서 기반 질문으로 실전 면접 흐름을 연습</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/report-point.gif" alt="트렌드와 활동 리포트" width="100%" />
      <br />
      <strong>트렌드와 활동 리포트</strong>
      <br />
      <sub>주간 학습 기록, 포인트, 배지, 리포트 차트를 제공</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/mypage-recommend.gif" alt="마이페이지 회고와 맞춤 추천" width="100%" />
      <br />
      <strong>마이페이지 회고와 맞춤 추천</strong>
      <br />
      <sub>회고, 맞춤 추천글, 추천 유튜브, 추천 서적을 한 흐름으로 제공</sub>
    </td>
    <td width="33%" valign="top" align="center">
      <img src="./docs/features/subscription.gif" alt="결제 시스템과 다크모드" width="100%" />
      <br />
      <strong>결제 시스템과 다크모드</strong>
      <br />
      <sub>구독 플랜, 결제 흐름, 사용자 환경 설정을 제공</sub>
    </td>
  </tr>
</table>

---

## Getting Started

### 사전 요구사항

- Node.js 20+
- npm

### 로컬 실행

```bash
git clone https://github.com/Devpick-Org/devpick-frontend.git
cd devpick-frontend
npm install
npm run dev
```

> 기본적으로 `.env.development`의 운영 API(`https://traceapp.site/v1`)를 사용합니다.
> 로컬 백엔드 서버를 사용하려면 `.env.local`에 아래 내용을 추가하세요.

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/v1
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...   # 토스페이먼츠 테스트 키 (백엔드 팀에게 요청)
```

### 빌드와 테스트

```bash
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
npm test        # Jest 단위 테스트
```

---

## CI/CD

| Job          | 트리거           | 설명                                  |
| ------------ | ---------------- | ------------------------------------- |
| Build & Lint | PR → developV2   | ESLint 체크와 Next.js 빌드 검증       |
| Auto Merge   | `automerge` 라벨 | CI 통과 시 developV2 자동 squash 머지 |

---

## 브랜치 전략

| 브랜치                       | 용도                 |
| ---------------------------- | -------------------- |
| `main`                       | 배포용               |
| `develop`                    | MVP                  |
| `developV2`                  | MVP 이후 통합 브랜치 |
| `feature/DP-{번호}-{기능명}` | 기능 개발            |
| `fix/DP-{번호}-{설명}`       | 버그 수정            |

---

## 팀

<table>
  <tr>
    <td align="center" width="180">
      <a href="https://github.com/uiuuoq">
        <img src="https://github.com/uiuuoq.png" width="96" height="96" style="border-radius: 50%;" alt="홍보민" />
      </a>
      <br />
      <strong>홍보민</strong>
      <br />
      <sub>Frontend</sub>
      <br />
      <a href="https://github.com/uiuuoq">@uiuuoq</a>
    </td>
  </tr>
</table>
