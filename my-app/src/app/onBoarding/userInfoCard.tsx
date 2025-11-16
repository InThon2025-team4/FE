"use client";

import { Button } from "@/components/ui/button";
import { TagDropDown } from "./tagDropDown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const techStackTags = [
  { id: "REACT", label: "React" },
  { id: "TYPESCRIPT", label: "TypeScript" },
  { id: "JAVASCRIPT", label: "JavaScript" },
  { id: "NEXTJS", label: "Next.js" },
  { id: "VUEJS", label: "Vue.js" },
  { id: "ANGULAR", label: "Angular" },
  { id: "SVELTE", label: "Svelte" },
  { id: "NODEJS", label: "Node.js" },
  { id: "PYTHON", label: "Python" },
  { id: "RUBY", label: "Ruby" },
  { id: "JAVA", label: "Java" },
  { id: "CSHARP", label: "C#" },
  { id: "PHP", label: "PHP" },
  { id: "GO", label: "Go" },
  { id: "DJANGO", label: "Django" },
  { id: "FASTAPI", label: "FastAPI" },
  { id: "TENSORFLOW", label: "TensorFlow" },
  { id: "NESTJS", label: "NestJS" },
];

const positionTags = [
  { id: "FRONTEND", label: "Frontend" },
  { id: "BACKEND", label: "Backend" },
  { id: "AI", label: "AI" },
  { id: "MOBILE", label: "Mobile" },
  { id: "PM", label: "PM" },
];

interface UserInfoCardProps {
  onNext: (data: { techStack: string[]; position: string[] }) => void;
}

export function UserInfoCard({ onNext }: UserInfoCardProps) {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);

  return (
    <>
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="text-left">
          <CardTitle>프로필 정보 입력</CardTitle>
          <CardDescription>팀 매칭을 위한 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 items-center">
                <div className="flex items-center">
                  <Label htmlFor="password">기술 스택</Label>
                </div>
                <TagDropDown
                  defaultTags={techStackTags}
                  selected={techStack}
                  setSelected={setTechStack}
                  placeholder="프레임워크를 선택하세요"
                ></TagDropDown>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">포지션</Label>
                </div>
                <TagDropDown
                  defaultTags={positionTags}
                  selected={position}
                  setSelected={setPosition}
                  placeholder="포지션을선택하세요"
                ></TagDropDown>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full bg-[var(--color-red)]"
            onClick={() => {
              if (techStack.length === 0) {
                alert("기술 스택을 선택해주세요.");
                return;
              }
              if (position.length === 0) {
                alert("포지션을 선택해주세요.");
                return;
              }
              onNext({ techStack, position });
            }}
          >
            다음
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
