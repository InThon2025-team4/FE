import { supabase } from "./supabase";

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
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { email, password, name, techStack, position, portfolio } = data;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          tech_stack: techStack,
          position,
          portfolio,
        },
      },
    });

    if (authError) {
      return {
        success: false,
        message: authError.message,
        error: authError,
      };
    }

    // If user profile table exists, create profile entry
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email,
          name,
          tech_stack: techStack,
          position,
          portfolio,
          created_at: new Date().toISOString(),
        },
      ]);

      // Ignore error if profiles table doesn't exist yet
      if (profileError) {
        console.warn("Profile creation warning:", profileError.message);
      }
    }

    return {
      success: true,
      message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      user: authData.user as unknown as User | undefined,
      session: authData.session,
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

    // Step 1: Get accessToken from Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
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

    // Step 2: Send accessToken to backend
    const response = await fetch(`${API_BASE_URL}/auth/supabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: authData.session.access_token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "백엔드 인증 실패",
        error: errorData,
      };
    }

    const beResponse = await response.json();

    // Step 3: Check if onboarding is required
    if (beResponse.onboardingRequired) {
      return {
        success: false,
        message: "온보딩이 필요합니다.",
        onboardingRequired: true,
        supabaseUid: beResponse.supabaseUid,
        email: beResponse.email,
        error: null,
      };
    }

    // Step 4: Store JWT token and return success
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
 * 1. Send accessToken + onboarding data to BE /auth/onboard
 * 2. BE creates user profile and returns JWT token
 * 3. Store JWT token for future authenticated requests
 */
export async function completeOnboarding(
  accessToken: string,
  onboardingData: OnboardingData
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/onboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        ...onboardingData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "온보딩 실패",
        error: errorData,
      };
    }

    const beResponse = await response.json();

    // Store JWT token
    if (beResponse.token) {
      storeToken(beResponse.token);
    }

    return {
      success: true,
      message: "온보딩 완료! 로그인되었습니다.",
      token: beResponse.token,
      user: beResponse.user,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "온보딩 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
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
    } = await supabase.auth.getUser();

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
    } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error) {
    return { session: null, error };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    return {
      success: true,
      message: "Google 로그인을 진행합니다...",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Google 로그인 중 오류가 발생했습니다.";
    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

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
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

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
