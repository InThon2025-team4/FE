"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { UserProfileSection } from "./UserProfileSection";
import { EditProfileDialog } from "./EditProfileDialog";
import { AppliedProjectsSection } from "./AppliedProjectsSection";
import { OwnedProjectsSection } from "./OwnedProjectsSection";
import { getAppliedProjects } from "@/lib/api/projects";
import { getMyProjects } from "@/lib/api/projects";
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
  tier?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  createdDate: string;
  deadline: string;
  positions: string[];
  applicationCount?: number;
}

export function MyPageView() {
  const [appliedProjects, setAppliedProjects] = useState<Project[]>([]);
  const [ownedProjects, setOwnedProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAppliedProjects();
        if (response.success && response.data) {
          // Transform API data to display format
          console.log(response.data);
          const transformedProjects = response.data.map((project) => ({
            id: project.id,
            title: project.name,
            description: project.description,
            status: "pending",
            createdDate: project.createdAt,
            deadline: formatDate(project.projectEndDate),
            positions: extractPositions({
              frontend: project.limitFE,
              backend: project.limitBE,
              ai: project.limitAI,
            }),
            applicantCount: project.applicationCount,
          }));
          setAppliedProjects(transformedProjects);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyProjects();
        if (response.success && response.data) {
          // Transform API data to display format
          console.log(response.data);
          const transformedProjects = response.data.map((project) => ({
            id: project.id,
            title: project.name,
            description: project.description,
            status: "pending",
            createdDate: project.createdAt,
            deadline: formatDate(project.projectEndDate),
            positions: extractPositions({
              frontend: project.limitFE,
              backend: project.limitBE,
              ai: project.limitAI,
            }),
            applicantCount: project.applicationCount,
          }));
          setOwnedProjects(transformedProjects);
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const extractPositions = (positions: {
    frontend?: number;
    backend?: number;
    ai?: number;
    mobile?: number;
  }): string[] => {
    const result: string[] = [];
    if (positions.frontend) result.push("프론트엔드");
    if (positions.backend) result.push("백엔드");
    if (positions.ai) result.push("인공지능");
    if (positions.mobile) result.push("모바일");
    return result;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  };

  // Mock user data - replace with actual data from your API/auth
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "사용자 이름",
    email: "user@example.com",
    initials: "CN",
    techStack: ["React", "TypeScript", "Next.js"],
    position: ["FE"],
    portfolio: "https://portfolio.example.com",
    tier: "GOLD",
  });

  // track which tab is active: 'applied' = 지원한 프로젝트, 'owned' = 내 프로젝트
  const [selectedTab, setSelectedTab] = useState<"applied" | "owned">(
    "applied"
  );

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
