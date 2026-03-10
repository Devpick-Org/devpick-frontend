import type { TokenPair, TokenStrategy } from "./TokenStrategy";

/**
 * TODO:
 * 추후 refreshToken을 HttpOnly Cookie 방식으로 전환할 경우 구현
 *
 * 주의:
 * HttpOnly Cookie는 JavaScript로 직접 읽을 수 없으므로
 * 현재 인터페이스를 그대로 유지할지,
 * 또는 cookie 전략 전용 흐름으로 분리할지 추후 재검토 필요
 */
export class CookieStrategy implements TokenStrategy {
  getAccessToken(): string | null {
    return null;
  }

  getRefreshToken(): string | null {
    return null;
  }

  getTokens(): TokenPair | null {
    return null;
  }

  setTokens(_accessToken: string, _refreshToken: string): void {
    // TODO: Cookie 전략 도입 시 구현
  }

  clearTokens(): void {
    // TODO: Cookie 전략 도입 시 구현
  }
}
