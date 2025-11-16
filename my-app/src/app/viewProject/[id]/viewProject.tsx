"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplyModal } from "./ApplyModal";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

export function ViewProject() {
  const router = useRouter();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { user } = await getCurrentUser();
      if (user?.id) {
        setCurrentUserId(user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  // Mock data - replace with actual data from props or API
  const projectData = {
    id: "project-123", // Add project ID for API calls
    title: "프로젝트 제목입니다",
    status: "모집 중",
    author: {
      id: "user-123", // Author's user ID
      name: "사용자 이름",
      avatar: null,
      initials: "CN",
    },
    createdAt: "2025. 11. 14",
    startDate: "2025. 11. 29",
    deadline: "2025. 11. 20",
    positions: {
      frontend: "마감",
      backend: "2 명",
      ai: "1 명",
      mobile: "마감",
    },
    duration: "1 개월",
    difficulty: "높음",
    description: "",
  };

  // Prepare available positions for the modal
  const availablePositions = [
    {
      label: "프론트엔드",
      value: "frontend",
      available: projectData.positions.frontend !== "마감",
    },
    {
      label: "백엔드",
      value: "backend",
      available: projectData.positions.backend !== "마감",
    },
    {
      label: "인공지능",
      value: "ai",
      available: projectData.positions.ai !== "마감",
    },
    {
      label: "모바일",
      value: "mobile",
      available: projectData.positions.mobile !== "마감",
    },
  ];

  // Check if current user is the project owner
  const isOwner = useMemo(() => {
    return currentUserId !== null && currentUserId === projectData.author.id;
  }, [currentUserId, projectData.author.id]);

  const handleApplySuccess = () => {
    // Navigate back to viewProject page (refresh or go to project list)
    router.refresh();
  };

  const handleEditProject = () => {
    router.push(`/project/${projectData.id}/edit`);
  };

  const handleViewApplications = () => {
    router.push(`/project/${projectData.id}/applications`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header userInitials="CN" showUser={true} />

      {/* Main Content */}
      <main className="w-full max-w-[1156px] mx-auto px-5 py-0 pt-0 pb-[120px] flex flex-col items-center gap-[66px]">
        {/* Title and Status Section */}
        <div className="w-full flex flex-col items-center gap-[15px] pt-[66px]">
          {/* Title Row */}
          <div className="w-full flex items-center justify-center gap-1.5">
            <div className="flex-1 flex flex-col justify-center gap-[15px]">
              <h2
                className=" text-1xl sm:text-3xl md:text-5xl lg:text-5xl
  font-semibold text-black leading-[1em] tracking-[-0.01em]"
              >
                {projectData.title}
              </h2>
            </div>
            <div className="px-[18px]">
              <Badge className="bg-[#488FE1] hover:bg-[#488FE1]/90 text-white text-sm font-medium px-6 py-2.5 rounded-full border-0">
                {projectData.status}
              </Badge>
            </div>
          </div>

          {/* Author and Date Section */}
          <div className="w-full flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#488FE1] flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-white">
                {projectData.author.initials}
              </span>
            </div>
            <span className="text-base font-medium text-[#0A0A0A]">
              {projectData.author.name}
            </span>
            <div className="w-[9px] h-[22px] border-l border-[#D9D9D9]" />
            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-[#505050] w-[100px]">
              {projectData.createdAt}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-5 border-t border-[#E5E5E5]" />
        </div>

        {/* Project Details Section */}
        <div className="w-[70%] h-[242px] flex flex-col items-center gap-6 py-6">
          {/* Row 1: Dates */}
          <div className="w-full flex items-center justify-around gap-6">
            <ProjectDetailItem
              label="시작 예정"
              value={projectData.startDate}
            />
            <ProjectDetailItem label="모집 마감" value={projectData.deadline} />
          </div>

          {/* Row 2: Positions */}
          <div className="w-full flex items-center justify-around  gap-6">
            <ProjectDetailItem
              label="프론트엔드"
              value={projectData.positions.frontend}
            />
            <ProjectDetailItem
              label="백엔드"
              value={projectData.positions.backend}
            />
          </div>

          {/* Row 3: More Positions */}
          <div className="w-full flex items-center justify-around  gap-6">
            <ProjectDetailItem
              label="인공지능"
              value={projectData.positions.ai}
            />
            <ProjectDetailItem
              label="모바일"
              value={projectData.positions.mobile}
            />
          </div>

          {/* Row 4: Duration and Difficulty */}
          <div className="w-full flex items-center justify-around  gap-6">
            <ProjectDetailItem label="예상 기간" value={projectData.duration} />
            <div className="w-[235px] h-[29px] flex items-center gap-2">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-[#505050] w-[100px]">
                난이도
              </span>
              <Badge className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white text-xs font-medium px-3 py-1 rounded-full border-0">
                {projectData.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="w-full flex flex-col items-end gap-2.5 px-[45px]">
          {isOwner ? (
            // Show edit and view applications buttons for project owner
            <div className="flex gap-2">
              <Button
                onClick={handleEditProject}
                className="bg-[#488FE1] hover:bg-[#488FE1]/90 text-white text-sm font-medium px-6 py-2.5 h-auto rounded-lg"
              >
                수정하기
              </Button>
              <Button
                onClick={handleViewApplications}
                className="bg-[#771F21] hover:bg-[#771F21]/90 text-white text-sm font-medium px-6 py-2.5 h-auto rounded-lg"
              >
                지원자 확인하기
              </Button>
            </div>
          ) : (
            // Show apply button for other users
            <Button
              onClick={() => setApplyModalOpen(true)}
              className="bg-[#771F21] hover:bg-[#771F21]/90 text-white text-sm font-medium px-6 py-2.5 h-auto rounded-lg"
            >
              지원하기
            </Button>
          )}
        </div>

        {/* Project Description Section */}
        <div className="w-full h-[283px] flex flex-col gap-2.5 py-6">
          {/* Section Title */}
          <div className="w-full flex items-center gap-2.5 px-6">
            <h3 className="text-xl font-semibold text-black tracking-[-0.02em] leading-[1.2em]">
              프로젝트 설명
            </h3>
          </div>

          {/* Description Card */}
          <div className="w-full h-[226px] flex flex-col items-stretch justify-stretch gap-4 px-6">
            <Card className="flex-1 bg-[#F5F5F5] rounded-xl flex flex-col items-center p-6 border-0">
              {/* Add project description content here */}
              <div className="text-sm text-[#505050]">
                {projectData.description ||
                  "프로젝트 설명이 여기에 표시됩니다."}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      <ApplyModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        projectId={projectData.id}
        availablePositions={availablePositions}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}

// Helper Component for Project Details
function ProjectDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-[235px] h-[29px] flex items-center gap-2.5">
      <span className="text-xs sm:text-sm md:text-base lg:text-lg text-[#505050] w-[100px]">
        {label}
      </span>
      <span className="text-xs sm:text-sm md:text-base lg:text-lg text-[#0A0A0A] w-[100px]">
        {value}
      </span>
    </div>
  );
}
