/**
 * Authentication Types
 * 
 * 사용자 인증 관련 타입 정의
 */

export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  profile?: UserProfile;
  consents?: UserConsents;
}

export interface UserProfile {
  user_id: string;
  age?: number;
  region?: string;
  job_category?: string;
  employment_status?: string;
  income_range?: string;
  education_level?: string;
  goals?: string[];
  interests?: string[];
  preferred_language: string;
  ai_personality?: string;
  onboarding_completed: boolean;
  profile_completion_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserConsents {
  privacy_policy: boolean;
  terms_of_service: boolean;
  push_notification: boolean;
  marketing_notification: boolean;
  data_analytics: boolean;
  personalized_ads: boolean;
}

// Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  access_token: string;
}

// Response Types
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    created_at: string;
  };
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    onboarding_completed: boolean;
  };
  token: TokenResponse;
}

// Auth Context Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}