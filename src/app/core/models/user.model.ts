export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface ResetPasswordRequest {
  phone: string;
  newPassword: string;
  reapeatPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
