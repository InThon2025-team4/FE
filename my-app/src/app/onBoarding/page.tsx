"use client";

import { UserInfoCard } from "../onBoarding/userInfoCard";
import { DevInfoCard } from "../onBoarding/devInfoCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function OnBoardingPage() {
  const [step, setStep] = useState<"user" | "dev">("user");
  const [progress, setProgress] = useState(75);
  const [userInfo, setUserInfo] = useState({
    techStack: [] as string[],
    position: [] as string[],
  });

  const handleUserInfoNext = (data: {
    techStack: string[];
    position: string[];
  }) => {
    setUserInfo(data);
    setStep("dev");
    setProgress(100);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-sm flex items-center">
        <Progress value={progress} className="w-[60%]" />
        {step === "user" ? (
          <UserInfoCard onNext={handleUserInfoNext} />
        ) : (
          <DevInfoCard userInfo={userInfo} />
        )}
      </Card>
    </div>
  );
}
