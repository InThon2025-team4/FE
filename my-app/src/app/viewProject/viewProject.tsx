"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplyModal } from "./[id]/ApplyModal";
import { getProjectById, Project } from "@/lib/api/projects";
import { TierIcon } from "@/components/TierIcon";

export function ViewProject() {
  const router = useRouter();
  const params = useParams();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data on mount
  useEffect(() => {
    const fetchProject = async () => {
      const projectId = params?.id as string;
      if (!projectId) {
        setError("Project ID not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getProjectById(projectId);
        if (response.success && response.data) {
          setProjectData(response.data);
        } else {
          setError(response.message || "Failed to load project");
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC143C]"></div>
          <p className="mt-4 text-gray-600">프로젝트 로딩 중...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            {error || "프로젝트를 찾을 수 없습니다"}
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-[#771F21] hover:bg-[#771F21]/90"
          >
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get user initials
  const getUserInitials = (name: string): string => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Prepare available positions for the modal
  const availablePositions = [
    {
      label: "프론트엔드",
      value: "frontend",
      available: Boolean(
        projectData.positions?.frontend &&
          projectData.positions.frontend !== "마감"
      ),
    },
    {
      label: "백엔드",
      value: "backend",
      available: Boolean(
        projectData.positions?.backend &&
          projectData.positions.backend !== "마감"
      ),
    },
    {
      label: "인공지능",
      value: "ai",
      available: Boolean(
        projectData.positions?.ai && projectData.positions.ai !== "마감"
      ),
    },
    {
      label: "모바일",
      value: "mobile",
      available: Boolean(
        projectData.positions?.mobile && projectData.positions.mobile !== "마감"
      ),
    },
  ];

  const handleApplySuccess = () => {
    // Navigate back to viewProject page (refresh or go to project list)
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-[#E5E5E5] flex items-center justify-center">
        <div className="w-full max-w-[1440px] px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded border-2 border-[#DC143C]" />
            <h1 className="text-base font-semibold text-[#0A0A0A]">
              Service Name
            </h1>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#488FE1] flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {getUserInitials(projectData.author.name)}
              </span>
            </div>
          </div>
        </div>
      </header>

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
                {getUserInitials(projectData.author.name)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-[#0A0A0A]">
                {projectData.author.name}
              </span>
              <TierIcon tier={3} size={20} />
            </div>
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
              value={projectData.positions.frontend || "마감"}
            />
            <ProjectDetailItem
              label="백엔드"
              value={projectData.positions.backend || "마감"}
            />
          </div>

          {/* Row 3: More Positions */}
          <div className="w-full flex items-center justify-around  gap-6">
            <ProjectDetailItem
              label="인공지능"
              value={projectData.positions.ai || "마감"}
            />
            <ProjectDetailItem
              label="모바일"
              value={projectData.positions.mobile || "마감"}
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

        {/* Apply Button Section */}
        <div className="w-full flex flex-col items-end gap-2.5 px-[45px]">
          <Button
            onClick={() => setApplyModalOpen(true)}
            className="bg-[#771F21] hover:bg-[#771F21]/90 text-white text-sm font-medium px-6 py-2.5 h-auto rounded-lg"
          >
            지원하기
          </Button>
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
