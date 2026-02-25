# Contributing Guide

처음 GitHub를 쓰는 팀을 위한 최소 규칙입니다.

## 1) 브랜치 전략

- `main`: 배포 가능한 안정 브랜치 (직접 push 금지)
- `develop`: 통합 개발 브랜치 (기능 완료 시 여기에 머지)
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치
- `hotfix/*`: 운영 긴급 수정 브랜치

브랜치 이름 예시:

- `feature/login-api`
- `feature/post-create`
- `fix/token-refresh`

## 2) 작업 순서

1. `develop` 최신화
2. 새 브랜치 생성
3. 기능 개발 + 커밋
4. 원격에 push
5. Pull Request 생성 (`feature/*` -> `develop`)
6. 리뷰 1명 이상 승인 후 머지

## 3) PR 전략

- 작은 단위 PR 권장 (가능하면 300줄 내외)
- PR 제목 형식: `[type] 작업 요약`
- type 예시: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- 본문에 목적/변경점/테스트 방법/스크린샷(필요 시) 포함
- 자기 PR은 본인이 merge 가능하되, 승인 1개 이상 필수

PR 제목 예시:

- `[feat] JWT 로그인 API 추가`
- `[fix] 토큰 만료 처리 오류 수정`

## 4) 커밋 메시지 규칙

형식: `type: 내용`

예시:

- `feat: 회원가입 API 추가`
- `fix: 로그인 예외 처리 수정`
- `docs: 기여 가이드 문서화`

## 5) 보호 규칙 (GitHub 설정 권장)

`main`, `develop` 브랜치에 대해:

- Pull Request 필수
- 최소 승인 1개
- 머지 전 CI 통과 필수(추후 액션 추가)
- 강제 push 금지

## 6) 처음 쓰는 팀을 위한 권장 머지 방식

- `Squash and merge`만 사용
- 이유: 커밋 이력이 깔끔해지고 되돌리기 쉬움

## 7) 자주 쓰는 명령어

```bash
# develop 최신화
git checkout develop
git pull origin develop

# 기능 브랜치 생성
git checkout -b feature/login-api

# 변경사항 커밋
git add .
git commit -m "feat: 로그인 API 추가"

# 원격 업로드
git push -u origin feature/login-api
```
