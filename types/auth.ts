export type BackendRole = "USER" | "AUTHOR" | "ADMIN";
export type UserRole = "Customer" | "Provider" | "Admin";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: AuthTokens;
};