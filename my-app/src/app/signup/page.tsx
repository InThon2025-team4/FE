"use client";

import { SignupCard } from "./signupCard";
import { UserInfoCard } from "../onBoarding/userInfoCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-sm flex items-center">
        <Progress value={25} className="w-[60%]" />
        <SignupCard></SignupCard>
      </Card>
    </div>
  );
}
