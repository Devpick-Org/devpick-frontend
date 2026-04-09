import type { ApiResponse } from "./api";

export type UserJob = "FRONTEND" | "BACKEND" | "FULLSTACK";
export type UserLevel = "BEGINNER" | "JUNIOR" | "MIDDLE" | "SENIOR";

export interface UserProfileBadge {
  badgeId: string;
  name: string;
}

export interface UserProfileRecentPost {
  id: string;
  title: string;
  createdAt: string;
}

export interface UserProfileRecentAnswer {
  answerId: string;
  postId: string;
  postTitle: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  nickname: string;
  profileImage?: string | null;
  job?: UserJob | null;
  level?: UserLevel | null;
  badges: UserProfileBadge[];
  recentPosts: UserProfileRecentPost[];
  recentAnswers: UserProfileRecentAnswer[];
}

export type UserProfileResponse = ApiResponse<UserProfile>;
