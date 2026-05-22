# devpick-frontend

> **Trace** | 개발자 성장 플랫폼 Next.js 프론트엔드 · 2026 캡스톤 프론트엔드<br>
> 전체 프로젝트 소개 → [Devpick-Org](https://github.com/Devpick-Org)

---

## 🛠️ 기술 스택

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
| CI/CD           | GitHub Actions            |
| 결제            | TossPayments SDK          |

---

## 🏗️ 시스템 구조

```
브라우저
  └─ Nginx (TLS)
       ├─ Next.js 프론트엔드 (:3000)  ← 이 레포
       └─ Spring Boot API 서버 (:8080)
              ├─ PostgreSQL (AWS RDS :5432)
              ├─ Redis (AWS ElastiCache :6379)
              ├─ MongoDB (:27017)
              └─ FastAPI AI 서버 (:8000)
```

---

## 📁 프로젝트 구조

```
├── app/
│   ├── (landing)/           # Route Group — GNB 없는 레이아웃 (랜딩 페이지)
│   ├── (main)/              # Route Group — GNB 있는 레이아웃
│   │   ├── home/            # 콘텐츠 피드 + 글 상세 + AI 퀴즈
│   │   ├── community/       # 커뮤니티 피드 + 게시글 작성/상세
│   │   ├── history/         # 학습 히스토리 (학습/활동/배지 탭)
│   │   ├── profile/         # 내 프로필 설정
│   │   ├── report/          # 주간 학습 분석 리포트
│   │   ├── trends/          # 개발 생태계 트렌드 (부트캠프·동아리·행사)
│   │   ├── plans/           # 구독 플랜 소개 (Free / Pro / Max 비교)
│   │   └── payment/         # 결제 플로우 (billing · success · fail)
│   ├── auth/                # OAuth 콜백 라우트 (GitHub, Google)
│   ├── onboarding/          # 초기 사용자 성향 파악
│   └── report/share/        # 공유 리포트 (비로그인 접근 가능)
├── components/
│   ├── ui/                  # 재사용 프리미티브 (shadcn/ui 기반)
│   ├── layout/              # GNB, 탭바 등 레이아웃 컴포넌트
│   └── features/            # 도메인별 기능 컴포넌트
│       ├── auth/            # 로그인/회원가입/OAuth 콜백
│       ├── home/            # 피드 카드, AI 요약, 퀴즈
│       ├── community/       # 게시글, 답변, AI 답변
│       ├── history/         # 타임라인, 배지, 포인트
│       ├── profile/         # 프로필 수정 폼
│       ├── report/          # 주간 리포트, 공유 리포트
│       ├── trends/          # 개발 생태계 트렌드 (부트캠프·동아리·행사)
│       ├── subscription/    # 구독 모달 (PlanUpgradeModal, LimitExceededModal, PlanCard)
│       └── landing/         # 랜딩 페이지
├── lib/
│   ├── api/                 # Axios 인스턴스 + 도메인별 API 함수
│   ├── auth/                # 토큰 관리 (Access: Zustand, Refresh: HttpOnly Cookie)
│   └── mock/                # 개발용 목 데이터
├── store/                   # Zustand 전역 상태 (auth, content, ui)
└── types/                   # TypeScript 전역 타입 정의
```

---

## ✨ 주요 기능

| 도메인   | 기능                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------- |
| 인증     | 이메일 회원가입·로그인, GitHub / Google OAuth2, JWT 갱신                                          |
| 프로필   | 내 프로필 조회·수정, 프로필 이미지 업로드, 회원 탈퇴                                              |
| 콘텐츠   | 관심 태그 기반 개인화 피드, 좋아요·스크랩 목록 조회, 좋아요, 검색, 맞춤 추천 (콘텐츠·유튜브·서적) |
| AI       | 레벨별 AI 요약, AI 퀴즈·오답노트, AI 질문 개선, AI 답변 생성                                      |
| 커뮤니티 | 질문 게시글 작성·수정·삭제, 답변 채택, 댓글, 유사 질문 조회                                       |
| 리포트   | 주간 학습 리포트 조회·공유 링크 생성, PDF 저장, 학습 히스토리                                     |
| 포인트   | 학습 행동별 포인트 적립, 배지 시스템                                                              |
| 채용     | 채용 공고 조회·상세, 북마크                                                                       |
| 이력서   | 이력서 관리                                                                                       |
| 트렌드   | 개발 생태계 트렌드 (부트캠프·동아리·행사)                                                         |
| 구독     | Free / Pro / Max 플랜 비교, 토스페이먼츠 카드 등록·구독 해지·환불, 플랜별 기능 제한 UI             |

---

## 🚀 Getting Started

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

> 기본적으로 `.env.development`의 운영 API(`https://3-39-96-126.sslip.io/v1`)를 사용합니다.  
> 로컬 백엔드 서버를 사용하려면 `.env.local`에 아래 내용을 추가하세요.

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/v1
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...   # 토스페이먼츠 테스트 키 (백엔드 팀에게 요청)
```

### 빌드 & 테스트

```bash
npm run build       # 프로덕션 빌드
npm run lint        # ESLint 검사
npm test            # Jest 단위 테스트
```

---

## 📖 주요 커맨드

| 커맨드          | 설명                       |
| --------------- | -------------------------- |
| `npm run dev`   | 개발 서버 실행 (포트 3000) |
| `npm run build` | 프로덕션 빌드              |
| `npm start`     | 프로덕션 서버 실행         |
| `npm run lint`  | ESLint 검사                |
| `npm test`      | Jest 단위 테스트           |

---

## ⚙️ CI/CD

| Job          | 트리거           | 설명                                  |
| ------------ | ---------------- | ------------------------------------- |
| Build & Lint | PR → developV2   | ESLint 체크 + Next.js 빌드 검증       |
| Auto Merge   | `automerge` 라벨 | CI 통과 시 developV2 자동 squash 머지 |

---

## 🔀 브랜치 전략

| 브랜치                       | 용도                                    |
| ---------------------------- | --------------------------------------- |
| `main`                       | 배포용                                  |
| `develop`                    | MVP                                     |
| `developV2`                  | MVP 이후 개발 통합 브랜치. PR 머지 대상 |
| `feature/DP-{번호}-{기능명}` | 기능 개발                               |
| `fix/DP-{번호}-{설명}`       | 버그 수정                               |

---

## 👥 팀

<table>
  <tr>
    <td align="center" width="180">
      <a href="https://github.com/khg9859">
        <img src="https://github.com/khg9859.png" width="96" height="96" style="border-radius: 50%;" alt="김홍근" />
      </a>
      <br />
      <strong>김홍근</strong>
      <br />
      <sub>PM / Backend Lead</sub>
      <br />
      <a href="https://github.com/khg9859">@khg9859</a>
    </td>
    <td align="center" width="180">
      <a href="https://github.com/nYeonG4001">
        <img src="https://github.com/nYeonG4001.png" width="96" height="96" style="border-radius: 50%;" alt="박하영" />
      </a>
      <br />
      <strong>박하영</strong>
      <br />
      <sub>Backend</sub>
      <br />
      <a href="https://github.com/nYeonG4001">@nYeonG4001</a>
    </td>
    <td align="center" width="180">
      <a href="https://github.com/suheon98">
        <img src="https://github.com/suheon98.png" width="96" height="96" style="border-radius: 50%;" alt="조수헌" />
      </a>
      <br />
      <strong>조수헌</strong>
      <br />
      <sub>AX</sub>
      <br />
      <a href="https://github.com/suheon98">@suheon98</a>
    </td>
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
