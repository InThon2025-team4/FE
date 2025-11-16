"use client";

import { UserInfoCard } from "./userInfoCard";
import { DevInfoCard } from "./devInfoCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeOnboarding, OnboardingData } from "@/lib/auth";

export default function OnBoardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"user" | "dev">("user");
  const [progress, setProgress] = useState(66);
  const [userInfo, setUserInfo] = useState({
    techStack: [] as string[],
    position: [] as string[],
  });
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 토큰과 이메일 추출
    const token = searchParams.get("supabaseToken");
    const userEmail = searchParams.get("email");

    if (!token || !userEmail) {
      // 필수 파라미터 누락 - 로그인으로 리다이렉트
      console.error("Missing required parameters for onboarding");
      router.push("/login?error=missing_onboarding_params");
      return;
    }

    setSupabaseToken(token);
    setEmail(userEmail);
  }, [searchParams, router]);

  const handleUserInfoNext = (data: {
    techStack: string[];
    position: string[];
  }) => {
    setUserInfo({
      techStack: data.techStack,
      position: data.position,
    });
    setStep("dev");
    setProgress(100);
  };

  const handleOnboardingComplete = async (onboardingData: any) => {
    if (!supabaseToken) {
      console.error("No supabase token available");
      alert("Supabase 토큰이 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // completeOnboarding 함수 사용
      const onboardingPayload: OnboardingData = {
        authProvider: "email",
        name: onboardingData.name,
        email: email || "",
        phone: onboardingData.phone,
        githubId: onboardingData.githubId || "",
        profileImageUrl: onboardingData.profileImageUrl,
        techStacks: onboardingData.techStacks || [],
        positions: onboardingData.positions || [],
        proficiency: onboardingData.proficiency || "UNKNOWN",
        portfolio: onboardingData.portfolio,
      };

      const result = await completeOnboarding(supabaseToken, onboardingPayload);

      if (!result.success) {
        throw new Error(result.message || "온보딩 실패");
      }

      console.log("Onboarding completed successfully");
      // 대시보드로 리다이렉트
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      alert(error instanceof Error ? error.message : "온보딩 중 오류 발생");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-sm flex items-center">
        <Progress
          value={progress}
          className="w-[60%]"
          indicatorClassName="bg-[var(--color-red)]"
        />
        {step === "user" ? (
          <UserInfoCard onNext={handleUserInfoNext} />
        ) : (
          <DevInfoCard 
            userInfo={userInfo} 
            onComplete={handleOnboardingComplete}
            isLoading={isLoading}
          />
        )}
      </Card>
    </div>
  );
}
