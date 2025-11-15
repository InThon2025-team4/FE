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
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "nextjs", label: "Next.js" },
  { id: "vuejs", label: "Vue.js" },
  { id: "angular", label: "Angular" },
  { id: "svelte", label: "Svelte" },
  { id: "nodejs", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "ruby", label: "Ruby" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "php", label: "PHP" },
  { id: "go", label: "Go" },
];

const positionTags = [
  { id: "0", label: "FE" },
  { id: "1", label: "BE" },
  { id: "2", label: "AI" },
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
        <CardHeader className="text-center">
          <CardTitle>Signup</CardTitle>
          <CardDescription>make your account</CardDescription>
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
            className="w-full"
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
