export interface User {
  id: number;
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

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  nickname: string;
}
