"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { UserProfileSection } from "./UserProfileSection";
import { EditProfileDialog } from "./EditProfileDialog";
import { AppliedProjectsSection } from "./AppliedProjectsSection";

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  techStack: string[];
  position: string[];
  portfolio?: string;
  bio?: string;
}

export interface AppliedProject {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  deadline: string;
  positions: string[];
}

export function MyPageView() {
  // Mock user data - replace with actual data from your API/auth
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "사용자 이름",
    email: "user@example.com",
    initials: "CN",
    techStack: ["React", "TypeScript", "Next.js"],
    position: ["FE"],
    portfolio: "https://portfolio.example.com",
    bio: "안녕하세요. 프론트엔드 개발자입니다.",
  });

  // Mock applied projects - replace with actual data from your API
  const [appliedProjects] = useState<AppliedProject[]>([
    {
      id: "1",
      title: "프로젝트 제목입니다",
      description: "프로젝트 설명이 여기에 표시됩니다.",
      status: "pending",
      appliedDate: "2025. 11. 14",
      deadline: "2025. 11. 20",
      positions: ["Frontend", "Backend"],
    },
    {
      id: "2",
      title: "두 번째 프로젝트",
      description: "두 번째 프로젝트 설명입니다.",
      status: "accepted",
      appliedDate: "2025. 11. 10",
      deadline: "2025. 11. 15",
      positions: ["Frontend"],
    },
    {
      id: "3",
      title: "세 번째 프로젝트",
      description: "세 번째 프로젝트 설명입니다.",
      status: "rejected",
      appliedDate: "2025. 11. 05",
      deadline: "2025. 11. 12",
      positions: ["Backend", "AI"],
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setIsEditDialogOpen(false);
    // TODO: Save to backend API
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header userInitials={userProfile.initials} />

      {/* Main Content */}
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-black">마이페이지</h2>
          </div>

          {/* User Profile Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">프로필</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(true)}
              >
                프로필 수정
              </Button>
            </CardHeader>
            <CardContent>
              <UserProfileSection profile={userProfile} />
            </CardContent>
          </Card>

          <Separator />

          {/* Applied Projects Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-black">
              지원한 프로젝트
            </h3>
            <AppliedProjectsSection projects={appliedProjects} />
          </div>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profile={userProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
