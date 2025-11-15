"use client";

import { SignupCard } from "./signupCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function SignUpPage() {
  const [progress] = useState(33);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Card className="w-full max-w-sm flex items-center">
        <Progress
          value={progress}
          className="w-[60%]"
          indicatorClassName="bg-[var(--color-red)]"
        />
        <SignupCard />
      </Card>
    </div>
  );
}
