"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProjectCard } from "./ProjectCard";

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 2,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 3,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 4,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 5,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 6,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 7,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 8,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
  {
    id: 9,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
  },
];

export default function DashboardView() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <Header userInitials="CN" showUser={true} />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-[71px] px-[142px] pb-[120px] w-[1440px]">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center gap-[34px] mt-[71px]">
          <h1 className="text-5xl font-semibold text-black text-center leading-[1em] tracking-[-0.01em] w-[686px]">
            새로운 프로젝트에 참여해보세요!
          </h1>

          {/* Search Bar */}
          <div className="relative w-[344px] h-9 bg-white border border-[#E5E5E5] rounded-md shadow-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-[#737373]" />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-10 pr-3 text-sm text-[#0A0A0A] placeholder:text-[#737373] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-6 w-[1116px]">
          {/* Row 1 */}
          <div className="flex items-center gap-4">
            {mockProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex items-center gap-4">
            {mockProjects.slice(3, 6).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex items-center gap-4">
            {mockProjects.slice(6, 9).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
