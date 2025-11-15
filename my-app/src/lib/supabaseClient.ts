import { supabase } from "./supabase";
import { SignInData, SignUpData } from "./auth";

/**
 * Initialize Supabase auth state listener
 * Must be called once on app load to handle token in URL hash
 */
export async function initializeAuthState() {
  // Supabase will automatically handle the session from URL hash
  // This function ensures the session is established
  return await supabase.auth.getSession();
}

/**
 * Get the appropriate callback URL based on environment
 * Uses NEXT_PUBLIC_APP_URL for server-side rendering compatibility
 * Falls back to window.location.origin on client-side
 */
function getCallbackUrl(): string {
  // 서버 사이드에서는 환경 변수 사용
  if (typeof window === "undefined") {
    return (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ) + "/auth/callback";
  }

  // 클라이언트 사이드에서도 환경 변수를 우선으로 사용 (프로덕션 환경 대비)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL + "/auth/callback";
  }

  // 환경 변수가 없으면 현재 origin 사용
  return window.location.origin + "/auth/callback";
}

function getResetPasswordUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ) + "/auth/reset-password";
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL + "/auth/reset-password";
  }

  return window.location.origin + "/auth/reset-password";
}

const CALLBACK_URL = getCallbackUrl();

export async function supabaseSignUp(data: SignUpData) {
  return await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: CALLBACK_URL,
      data: {
        name: data.name,
        tech_stack: data.techStack,
        position: data.position,
        portfolio: data.portfolio,
      },
    },
  });
}

export async function supabaseSignIn(data: SignInData) {
  return await supabase.auth.signInWithPassword(data);
}

export async function supabaseSignOut() {
  return await supabase.auth.signOut();
}

export async function getSupabaseUser() {
  return await supabase.auth.getUser();
}

export async function getSupabaseSession() {
  return await supabase.auth.getSession();
}

export async function resetPasswordEmail(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getResetPasswordUrl(),
  });
}

export async function updateUserPassword(newPassword: string) {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}
