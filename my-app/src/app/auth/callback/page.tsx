"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeAuthState, getSupabaseSession } from "@/lib/supabaseClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Step 1: Supabase 토큰 명시적 초기화
        // URL 해시에서 토큰을 감지하고 세션 설정
        await initializeAuthState();

        // Step 2: 세션 확인 (재확인)
        const { data: { session }, error: sessionError } = 
          await getSupabaseSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("인증 실패: " + sessionError.message);
          setTimeout(() => router.push("/login?error=authentication_failed"), 2000);
          return;
        }

        if (!session?.user) {
          console.error("No session or user found after token processing");
          setError("인증 정보를 찾을 수 없습니다.");
          setTimeout(() => router.push("/login?error=no_session"), 2000);
          return;
        }

        console.log("Session established for user:", session.user.email);

        // Step 3: 백엔드 서버에 Supabase 액세스 토큰 전송
        const supabaseAccessToken = session.access_token;
        
        if (!supabaseAccessToken) {
          setError("액세스 토큰을 얻을 수 없습니다.");
          setTimeout(() => router.push("/login?error=no_access_token"), 2000);
          return;
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/supabase`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: supabaseAccessToken,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
          }

          const beResponse = await response.json();

          // Step 4: 백엔드 응답에 따라 분기
          if (beResponse.onboardingRequired) {
            // 새 사용자 - 온보딩 페이지로 강제 이동
            // supabaseToken과 email을 URL 파라미터로 전달
            console.log("New user detected, redirecting to onboarding");
            router.push(
              `/onboarding?supabaseToken=${encodeURIComponent(supabaseAccessToken)}&email=${encodeURIComponent(beResponse.email || session.user.email)}`
            );
          } else if (beResponse.token) {
            // 기존 사용자 - JWT 토큰 저장 후 대시보드로 이동
            console.log("Existing user detected, redirecting to dashboard");
            localStorage.setItem("jwtToken", beResponse.token);
            // Supabase 세션은 유지하되, 이후 요청은 JWT 사용
            router.push("/dashboard");
          } else {
            throw new Error("예상치 못한 응답 형식: token 또는 onboardingRequired 필요");
          }
        } catch (backendError) {
          console.error("Backend communication error:", backendError);
          setError(
            backendError instanceof Error 
              ? backendError.message 
              : "서버 통신 실패"
          );
          setTimeout(() => router.push("/login?error=backend_error"), 2000);
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("예상치 못한 오류 발생");
        setTimeout(() => router.push("/login?error=unexpected_error"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="mt-2 text-gray-600 text-sm">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC143C]"></div>
        <p className="mt-4 text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  );
}
