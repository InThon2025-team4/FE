"use client";

import { UserInfoCard } from "../onBoarding/userInfoCard";
import { DevInfoCard } from "../onBoarding/devInfoCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function OnBoardingPage() {
  const [step, setStep] = useState<"user" | "dev">("user");
  const [progress, setProgress] = useState(66);
  const [userInfo, setUserInfo] = useState({
    techStack: [] as string[],
    position: [] as string[],
    portfolio: "",
  });

  const handleUserInfoNext = (data: {
    techStack: string[];
    position: string[];
    portfolio?: string;
  }) => {
    setUserInfo({
      techStack: data.techStack,
      position: data.position,
      portfolio: data.portfolio || "",
    });
    setStep("dev");
    setProgress(100);
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
          <DevInfoCard userInfo={userInfo} />
        )}
      </Card>
    </div>
  );
}
