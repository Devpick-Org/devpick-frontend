import { TokenStrategy, TokenPair } from "./TokenStrategy";
import { SessionStorageStrategy } from "./SessionStorageStrategy";

class TokenManager {
  private strategy: TokenStrategy;

  constructor(strategy: TokenStrategy) {
    this.strategy = strategy;
  }

  /**
 나중에 쿠키 방식으로 바뀔 때 전략만 쓱 바꿔 끼우는 함수
  setStrategy(strategy: TokenStrategy) {
    this.strategy = strategy;
  }
    */

  getTokens(): TokenPair | null {
    return this.strategy.getTokens();
  }

  getAccessToken(): string | null {
    return this.strategy.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.strategy.getRefreshToken();
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.strategy.setTokens(accessToken, refreshToken);
  }

  clearTokens(): void {
    this.strategy.clearTokens();
  }
}

export const tokenManager = new TokenManager(new SessionStorageStrategy());
