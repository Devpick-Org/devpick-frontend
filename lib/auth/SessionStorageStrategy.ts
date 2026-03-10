import type { TokenPair, TokenStrategy } from "./TokenStrategy";

const ACCESS_TOKEN_KEY = "devpick_access_token";
const REFRESH_TOKEN_KEY = "devpick_refresh_token";

export class SessionStorageStrategy implements TokenStrategy {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getTokens(): TokenPair | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
