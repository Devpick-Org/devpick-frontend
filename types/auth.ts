export interface User {
  userId: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  jobType?: string;
  level?: string;
  tags?: string[];
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
