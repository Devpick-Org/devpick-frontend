export interface RepresentativeBadge {
  badgeId: string;
  name: string;
  acquiredAt: string;
}

export interface User {
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  job?: string;
  level?: string;
  tags?: string[];
  totalPoints?: number;
  representativeBadge?: RepresentativeBadge | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  nickname: string;
}

export interface SocialAuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  nickname: string;
  isNewUser: boolean;
}

export interface OAuthStartResponse {
  authorizationUrl: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SocialRecoverRequest {
  recoveryToken: string;
}
