"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  // utility to split projects into rows of `size`
  const chunk = <T,>(arr: T[], size: number) => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

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
          <div className="flex items-center gap-4">
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
            <Link href="/newProject">
              <Button
                variant="ghost"
                className="bg-[#DC143C] hover:bg-[#771F21]/90 text-white text-sm font-medium px-6 py-2.5 h-auto rounded-lg"
              >
                새 프로젝트 생성
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-6 w-[1116px]">
          {chunk(mockProjects, 3).map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-4">
              {row.map((project) => (
                <Link
                  key={project.id}
                  href={`/viewProject/${project.id}`}
                  className="block"
                >
                  <ProjectCard {...project} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
