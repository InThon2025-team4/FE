"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { UserProfileSection } from "./UserProfileSection";
import { EditProfileDialog } from "./EditProfileDialog";
import { AppliedProjectsSection } from "./AppliedProjectsSection";
import { OwnedProjectsSection } from "./OwnedProjectsSection";
import App from "next/app";

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

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  deadline: string;
  positions: string[];
  applicationCount?: number;
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
  const [appliedProjects] = useState<Project[]>([
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
    {
      id: "4",
      title: "세 번째 프로젝트",
      description: "세 번째 프로젝트 설명입니다.",
      status: "rejected",
      appliedDate: "2025. 11. 05",
      deadline: "2025. 11. 12",
      positions: ["Backend", "AI"],
    },
  ]);

  // track which tab is active: 'applied' = 지원한 프로젝트, 'owned' = 내 프로젝트
  const [selectedTab, setSelectedTab] = useState<"applied" | "owned">(
    "applied"
  );

  // mock "내 프로젝트" list (replace with real data)
  const [ownedProjects] = useState<Project[]>([
    {
      id: "o1",
      title: "내 프로젝트 A",
      description: "내가 만든 프로젝트 A 설명",
      status: "accepted",
      appliedDate: "2025. 10. 01",
      deadline: "2025. 12. 01",
      positions: ["Frontend"],
      applicationCount: 5,
    },
    {
      id: "o2",
      title: "내 프로젝트 B",
      description: "내가 만든 프로젝트 B 설명",
      status: "pending",
      appliedDate: "2025. 09. 15",
      deadline: "2025. 11. 30",
      positions: ["Backend", "AI"],
      applicationCount: 3,
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

          {/* Applied / Owned Projects Section */}
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTab("applied")}
                aria-pressed={selectedTab === "applied"}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  selectedTab === "applied" ? "text-black" : "text-gray-400"
                }`}
              >
                지원한 프로젝트
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("owned")}
                aria-pressed={selectedTab === "owned"}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  selectedTab === "owned" ? "text-black" : "text-gray-400"
                }`}
              >
                내 프로젝트
              </button>
            </div>

            <h3 className="text-2xl font-semibold text-black">
              {selectedTab === "applied" ? "지원한 프로젝트" : "내 프로젝트"}
            </h3>
            {selectedTab === "applied" && (
              <AppliedProjectsSection projects={appliedProjects} />
            )}
            {selectedTab === "owned" && (
              <OwnedProjectsSection projects={ownedProjects} />
            )}
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
