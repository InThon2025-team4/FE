import axios from "axios";
import { supabase } from "./supabase";

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

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: unknown;
  session?: unknown;
  error?: unknown;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { email, password, name, techStack, position, portfolio } = data;

    if (!/^[^\s@]+@korea\.(ac\.kr|edu)$/.test(email.trim())) {
      return {
        success: false,
        message:
          "고려대학교 이메일 주소(korea.ac.kr 또는 korea.edu)를 입력해주세요.",
      };
    }
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

    // Case 1: User exists but is not confirmed
    if (authData.user && !authData.session) {
      return {
        success: true,
        message: "가입 확인을 위해 이메일을 확인해주세요.",
        user: authData.user,
      };
    }

    // Case 2: User is created and session is active
    if (authData.user && authData.session) {
      // Create profile entry
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

      if (profileError) {
        console.warn("Profile creation warning:", profileError.message);
        // Depending on the app's logic, you might want to return an error here
      }

      // Get AccessToken from your backend
      try {
        const supabaseAccessToken = authData.session.access_token;
        const response = await axios.post("/auth/supabase/", {
          accessToken: supabaseAccessToken,
        });

        if (response.data.access_token) {
          localStorage.setItem("accessToken", response.data.access_token);
          return {
            success: true,
            message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
            user: authData.user,
            session: authData.session,
          };
        } else {
          throw new Error("백엔드로부터 AccessToken을 받지 못했습니다.");
        }
      } catch (apiError) {
        const errorMessage =
          apiError instanceof Error
            ? apiError.message
            : "API 서버와 통신 중 오류가 발생했습니다.";
        return {
          success: false,
          message: errorMessage,
          error: apiError,
        };
      }
    }

    // Case 3: Unexpected response from Supabase
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
 * Sign in an existing user with email and password
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { email, password } = data;

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

    if (authData.user && authData.session) {
      // Get AccessToken from your backend
      try {
        const supabaseAccessToken = authData.session.access_token;
        const response = await axios.post("/auth/supabase/", {
          accessToken: supabaseAccessToken,
        });

        if (response.data.access_token) {
          localStorage.setItem("accessToken", response.data.access_token);
          return {
            success: true,
            message: "로그인 성공!",
            user: authData.user,
            session: authData.session,
          };
        } else {
          throw new Error("백엔드로부터 AccessToken을 받지 못했습니다.");
        }
      } catch (apiError) {
        const errorMessage =
          apiError instanceof Error
            ? apiError.message
            : "API 서버와 통신 중 오류가 발생했습니다.";
        return {
          success: false,
          message: errorMessage,
          error: apiError,
        };
      }
    }

    return {
      success: false,
      message: "로그인에 실패했습니다. 사용자 정보나 세션을 찾을 수 없습니다.",
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
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
        error,
      };
    }

    // Remove the accessToken from localStorage
    localStorage.removeItem("accessToken");

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
