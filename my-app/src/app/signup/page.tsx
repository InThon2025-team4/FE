"use client";

import { SignupCard } from "./signupCard";
import { UserInfoCard } from "./userInfoCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
export default function SignUpPage() {
  const [progress, setProgress] = useState(50);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-sm flex items-center">
        <Progress value={progress} className="w-[60%]" />
        {progress == 50 && <SignupCard setProgress={setProgress}></SignupCard>}
        {progress == 100 && <UserInfoCard></UserInfoCard>}
      </Card>
    </div>
  );
}
