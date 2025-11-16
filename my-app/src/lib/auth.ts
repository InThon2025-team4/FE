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
  authProvider: string;
  name: string;
  email: string;
  phone: string;
  githubId: string;
  profileImageUrl?: string;
  techStacks: string[];
  positions: string[];
  proficiency?: string;
  portfolio?: Record<string, unknown>;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  session?: unknown;
  token?: string;
  accessToken?: string;
  error?: unknown;
  requiresOnboarding?: boolean;
  supabaseUid?: string;
  email?: string;
  supabaseAccessToken?: string;
}

/**
 * Helper function to store JWT token
 */
export function storeToken(token: string): void {
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
 * Backend endpoint: POST /auth/supabase
 * 
 * Request:
 * { accessToken: "supabase_access_token" }
 * 
 * Response 1 - Existing user (온보딩 완료):
 * {
 *   accessToken: "jwt_token",
 *   user: { id, email, name, ... }
 * }
 * 
 * Response 2 - New user (온보딩 필요):
 * {
 *   requiresOnboarding: true,
 *   supabaseUid: "uid",
 *   email: "email",
 *   displayName: "name",
 *   supabaseAccessToken: "token"
 * }
 */
export async function signInWithSupabase(
  data: SignInData
): Promise<AuthResponse> {
  try {
    const { email, password } = data;

    // Step 1: Supabase 로그인
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

    // Step 2: 백엔드 /auth/supabase에 Supabase accessToken 전송
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

      // Case 1: 기존 사용자 (온보딩 완료)
      // Response: { accessToken, user }
      if (beResponse.accessToken && beResponse.user) {
        storeToken(beResponse.accessToken);
        return {
          success: true,
          message: "로그인 성공!",
          token: beResponse.accessToken,
          accessToken: beResponse.accessToken,
          user: beResponse.user,
          error: null,
        };
      }

      // Case 2: 신규 사용자 (온보딩 필요)
      // Response: { requiresOnboarding: true, supabaseUid, email, displayName, supabaseAccessToken }
      if (beResponse.requiresOnboarding === true && beResponse.supabaseAccessToken) {
        return {
          success: false,
          message: "온보딩이 필요합니다.",
          onboardingRequired: true,
          requiresOnboarding: true,
          supabaseUid: beResponse.supabaseUid,
          email: beResponse.email,
          supabaseAccessToken: beResponse.supabaseAccessToken,
          error: null,
        };
      }

      // Case 3: 예상치 못한 응답 형식
      return {
        success: false,
        message: "예상치 못한 응답 형식입니다.",
        error: new Error("Unexpected response format"),
      };
    } catch (error) {
      const axiosError = error as any;
      const errorData = axiosError.response?.data || {};
      console.error("Backend /auth/supabase error:", errorData);
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
 * Complete onboarding for new users
 *
 * Backend endpoint: POST /auth/onboard
 * 
 * Request:
 * {
 *   accessToken: "supabase_access_token_from_login",
 *   authProvider: "email",
 *   name: "user name",
 *   email: "user@korea.ac.kr",
 *   phone: "010-XXXX-XXXX",
 *   githubId: "github_username",
 *   profileImageUrl?: "image_url",
 *   techStacks: ["NEXTJS", "TYPESCRIPT"],
 *   positions: ["FRONTEND"],
 *   proficiency?: "GOLD",
 *   portfolio?: { githubUrl: "url" }
 * }
 * 
 * Response:
 * {
 *   accessToken: "jwt_token",
 *   user: { id, email, name, ... }
 * }
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

    // 필수 필드 검증
    if (!onboardingData.name || !onboardingData.email || !onboardingData.phone) {
      return {
        success: false,
        message: "필수 정보가 누락되었습니다.",
        error: new Error("Missing required fields"),
      };
    }

    const payload = {
      accessToken: supabaseAccessToken,
      authProvider: onboardingData.authProvider || "email",
      name: onboardingData.name,
      email: onboardingData.email,
      phone: onboardingData.phone,
      githubId: onboardingData.githubId || "",
      profileImageUrl: onboardingData.profileImageUrl || null,
      techStacks: onboardingData.techStacks || [],
      positions: onboardingData.positions || [],
      proficiency: onboardingData.proficiency || "UNKNOWN",
      portfolio: onboardingData.portfolio || null,
    };

    const response = await axios.post(
      `${API_BASE_URL}/auth/onboard`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const beResponse = response.data;

    // 응답에서 JWT 토큰 확인
    if (!beResponse.accessToken) {
      return {
        success: false,
        message: "백엔드로부터 JWT 토큰을 받지 못했습니다.",
        error: new Error("No JWT token in response"),
      };
    }

    // JWT 토큰 저장
    storeToken(beResponse.accessToken);

    return {
      success: true,
      message: "온보딩 완료! 로그인되었습니다.",
      token: beResponse.accessToken,
      accessToken: beResponse.accessToken,
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
