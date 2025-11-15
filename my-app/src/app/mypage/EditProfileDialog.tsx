"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagDropDown } from "../onBoarding/tagDropDown";
import type { UserProfile } from "./MyPageView";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

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
  { id: "FE", label: "FE" },
  { id: "BE", label: "BE" },
  { id: "AI", label: "AI" },
  { id: "Mobile", label: "Mobile" },
];

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSave,
}: EditProfileDialogProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || "");
  const [portfolio, setPortfolio] = useState(profile.portfolio || "");
  const [techStack, setTechStack] = useState<string[]>(profile.techStack);
  const [position, setPosition] = useState<string[]>(profile.position);

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      name,
      bio,
      portfolio,
      techStack,
      position,
    };
    onSave(updatedProfile);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form on close
      setName(profile.name);
      setBio(profile.bio || "");
      setPortfolio(profile.portfolio || "");
      setTechStack(profile.techStack);
      setPosition(profile.position);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            프로필 정보를 수정하고 저장하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* Bio */}
          <div className="grid gap-2">
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              rows={4}
            />
          </div>

          {/* Tech Stack */}
          <div className="grid gap-2">
            <Label htmlFor="techStack">기술 스택</Label>
            <TagDropDown
              defaultTags={techStackTags}
              selected={techStack}
              setSelected={setTechStack}
              placeholder="기술 스택을 선택하세요"
            />
          </div>

          {/* Position */}
          <div className="grid gap-2">
            <Label htmlFor="position">포지션</Label>
            <TagDropDown
              defaultTags={positionTags}
              selected={position}
              setSelected={setPosition}
              placeholder="포지션을 선택하세요"
            />
          </div>

          {/* Portfolio */}
          <div className="grid gap-2">
            <Label htmlFor="portfolio">포트폴리오 링크 (선택)</Label>
            <Input
              id="portfolio"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://portfolio.example.com"
              type="url"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
