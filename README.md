# Trace FE

Trace 캡스톤 프론트엔드 저장소입니다.

## 팀 Git 규칙

- 브랜치 전략과 PR 규칙은 `CONTRIBUTING.md`를 따릅니다.

## 빠른 시작

1. 저장소 클론
2. `CONTRIBUTING.md` 확인
3. 본인 작업 브랜치 생성 후 개발 시작

## 로컬에서 백엔드와 붙여 테스트 (운영 API 기본값은 유지)

- 프론트는 `NEXT_PUBLIC_API_BASE_URL` 이 없으면 **운영 API**를 쓰도록 되어 있음 (`lib/api/client.ts`).
- **로컬 Spring(보통 `http://localhost:8080/v1`)** 으로 로그인·API까지 끝까지 보려면 아래 중 하나만 쓰면 됨.
  1. **`env.local.sample`** 을 참고해 `.env.local` 에 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/v1` 한 줄 추가 (기존 env 내용은 유지).
  2. 또는 **`npm run dev:local`** — 같은 효과이며 `.env` 파일을 건드리지 않음.
- 백엔드는 `devpick-backend` 의 `.env.example` 기준으로 `FRONTEND_URL=http://localhost:3000` , GitHub/Google OAuth 앱에 `http://localhost:3000/auth/.../callback` 등록이 필요함. 상세는 백엔드 `AGENTS.md` §9.
