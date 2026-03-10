export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStrategy {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  getTokens(): TokenPair | null;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}
