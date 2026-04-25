# Trace FE

Trace 캡스톤 프론트엔드 저장소입니다.

## 팀 Git 규칙

- 브랜치 전략과 PR 규칙은 `CONTRIBUTING.md`를 따릅니다.

## 빠른 시작

1. 저장소 클론
2. `CONTRIBUTING.md` 확인
3. 본인 작업 브랜치 생성 후 개발 시작

## 프론트 로컬 실행

- `next dev` 는 `.env.development` 를 통해 기본적으로 **운영 API(`https://3-39-96-126.sslip.io/v1`)** 를 사용함.
- 개인/임시 API로 바꾸려면 **`env.local.sample`** 을 참고해 `.env.local` 에 `NEXT_PUBLIC_API_BASE_URL=...` 를 추가하면 됨.
- 백엔드·AI는 운영 서버를 사용하고, 프론트만 `http://localhost:3000` 에서 실행함.
