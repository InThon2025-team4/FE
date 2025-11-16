import axios from "axios";
import {
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut,
  getSupabaseUser,
  getSupabaseSession,
  resetPasswordEmail,
  updateUserPassword,
} from "./supabaseClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Server User type from backend
export interface User {
  id: string;
  supabaseUid: string;
  authProvider: string;
  email: string;
  name: string;
  phone: string;
  githubId: string;
  profileImageUrl: string | null;
  techStacks: string[]; // TechStack enum
  positions: string[]; // Position enum
  proficiency: string; // Proficiency enum
  portfolio: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  createdProjects?: unknown[];
  projectsAsMember?: unknown[];
  applications?: unknown[];
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  techStack?: string[];
  position?: string[];
  portfolio?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface OnboardingData {
  name: string;
  phone?: string;
  github?: string;
  techStack: string[];
  position?: string[];
  portfolio?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  session?: unknown;
  token?: string;
  error?: unknown;
  onboardingRequired?: boolean;
  supabaseUid?: string;
  email?: string;
}

/**
 * Helper function to store JWT token
 */
function storeToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwtToken", token);
  }
}

/**
 * Helper function to get stored JWT token
 */
export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwtToken");
  }
  return null;
}

/**
 * Helper function to clear stored token
 */
function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwtToken");
  }
}

/**
 * Make authenticated API request with JWT token
 *
 * Usage:
 * const response = await authenticatedFetch('/users/profile', {
 *   method: 'GET'
 * });
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.headers && typeof options.headers === "object") {
    Object.assign(headers, options.headers);
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Sign up a new user with email and password (Supabase)
 *
 * Flow:
 * 1. Validate email (must be korea.ac.kr or korea.edu)
 * 2. Send sign up request to Supabase with email redirect callback to /auth/callback
 * 3. User receives confirmation email
 * 4. User clicks confirmation link -> redirects to /auth/callback
 * 5. /auth/callback handles token processing and backend communication
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { email, password } = data;

    if (!/^[^\s@]+@korea\.(ac\.kr|edu)$/.test(email.trim())) {
      return {
        success: false,
        message:
          "고려대학교 이메일 주소(korea.ac.kr 또는 korea.edu)를 입력해주세요.",
      };
    }

    // supabaseClient의 supabaseSignUp 함수 사용
    // emailRedirectTo가 자동으로 /auth/callback으로 설정됨
    const { data: authData, error: authError } = await supabaseSignUp(data);

    if (authError) {
      return {
        success: false,
        message: authError.message,
        error: authError,
      };
    }

    if (authData.user && !authData.session) {
      return {
        success: false,
        message: "가입 확인을 위해 이메일을 확인해주세요.",
        user: authData.user as unknown as User | undefined,
      };
    }

    if (authData.user && authData.session) {
      return {
        success: true,
        message: "회원가입 성공! 온보딩을 진행해주세요.",
        onboardingRequired: true,
        supabaseUid: authData.user.id,
        email: authData.user.email,
        token: authData.session.access_token,
      };
    }

    return {
      success: false,
      message: "알 수 없는 오류가 발생했습니다.",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "회원가입 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Sign in with Supabase and send accessToken to backend
 *
 * Flow:
 * 1. Get accessToken from Supabase
 * 2. Send to BE /auth/supabase endpoint
 * 3. BE validates token and checks if user exists
 * 4. If existing user: return JWT token
 * 5. If new user: return onboardingRequired flag
 */
export async function signInWithSupabase(
  data: SignInData
): Promise<AuthResponse> {
  try {
    const { email, password } = data;

    const { data: authData, error: authError } = await supabaseSignIn({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        message: authError.message,
        error: authError,
      };
    }

    if (!authData.session?.access_token) {
      return {
        success: false,
        message: "액세스 토큰을 획득하지 못했습니다.",
        error: new Error("No access token"),
      };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/supabase`,
        {
          accessToken: authData.session.access_token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const beResponse = response.data;

      if (beResponse.onboardingRequired) {
        return {
          success: false,
          message: "온보딩이 필요합니다.",
          onboardingRequired: true,
          supabaseUid: beResponse.supabaseUid,
          email: beResponse.email,
          token: authData.session.access_token,
          error: null,
        };
      }

      if (beResponse.token) {
        storeToken(beResponse.token);
      }

      return {
        success: true,
        message: "로그인 성공!",
        token: beResponse.token,
        user: beResponse.user,
        error: null,
      };
    } catch (error) {
      const axiosError = error as any;
      const errorData = axiosError.response?.data || {};
      return {
        success: false,
        message: errorData.message || "백엔드 인증 실패",
        error: errorData,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Sign in an existing user with email and password (legacy)
 */
/**
 * Complete onboarding for new users
 *
 * Flow:
 * 1. Send supabaseAccessToken + onboarding data to BE /auth/onboard
 * 2. BE creates user profile and returns JWT token
 * 3. Store JWT token for future authenticated requests
 * 4. Return success response
 */
export async function completeOnboarding(
  supabaseAccessToken: string,
  onboardingData: OnboardingData
): Promise<AuthResponse> {
  try {
    if (!supabaseAccessToken) {
      return {
        success: false,
        message: "Supabase 토큰이 없습니다. 다시 로그인해주세요.",
        error: new Error("Missing supabase token"),
      };
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/onboard`,
      {
        accessToken: supabaseAccessToken,
        ...onboardingData,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const beResponse = response.data;

    // JWT 토큰 저장
    if (beResponse.token) {
      storeToken(beResponse.token);
    } else {
      return {
        success: false,
        message: "백엔드로부터 JWT 토큰을 받지 못했습니다.",
        error: new Error("No JWT token in response"),
      };
    }

    return {
      success: true,
      message: "온보딩 완료! 로그인되었습니다.",
      token: beResponse.token,
      user: beResponse.user,
      error: null,
    };
  } catch (error) {
    const axiosError = error as any;
    const errorData = axiosError.response?.data || {};
    console.error("Onboarding error:", errorData);
    return {
      success: false,
      message: errorData.message || "온보딩 실패",
      error: errorData,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabaseSignOut();
    clearToken();

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    return {
      success: true,
      message: "로그아웃 되었습니다.",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "로그아웃 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await getSupabaseUser();

    if (error) {
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await getSupabaseSession();

    if (error) {
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await resetPasswordEmail(email);

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    return {
      success: true,
      message: "비밀번호 재설정 이메일이 발송되었습니다.",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "비밀번호 재설정 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResponse> {
  try {
    const { error } = await updateUserPassword(newPassword);

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    return {
      success: true,
      message: "비밀번호가 변경되었습니다.",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "비밀번호 변경 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}
