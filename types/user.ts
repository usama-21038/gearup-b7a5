import type { BackendRole } from "./auth";

export type UserStatus = "Active" | "Suspended";

export type UserProfile = {
  id: string;
  profilePhoto?: string | null;
  bio?: string | null;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  activeStatus: UserStatus | string;
  role: BackendRole | string;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile | null;
};

export type CurrentUserResponse = {
  success: boolean;
  message?: string;
  data?: {
    profile: User;
  };
};