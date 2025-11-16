"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardProjects, Project } from "@/lib/api/projects";

// Mock data for projects (fallback)
const mockProjects = [
  {
    id: 1,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "김개발", avatar: "KD", tier: 3 },
  },
  {
    id: 2,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "이디자인", avatar: "LD", tier: 4 },
  },
  {
    id: 3,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "박백엔드", avatar: "PB", tier: 2 },
  },
  {
    id: 4,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "최프론트", avatar: "CP", tier: 5 },
  },
  {
    id: 5,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "정풀스택", avatar: "JP", tier: 3 },
  },
  {
    id: 6,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "한모바일", avatar: "HM", tier: 1 },
  },
  {
    id: 7,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "신인공지능", avatar: "SI", tier: 4 },
  },
  {
    id: 8,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "오데브옵스", avatar: "OD", tier: 2 },
  },
  {
    id: 9,
    title: "프로젝트 제목",
    daysAgo: "2일 전",
    difficulty: "보통" as const,
    positions: ["프론트엔드", "백엔드"],
    deadline: "2025. 11. 14",
    author: { name: "유테스터", avatar: "YT", tier: 3 },
  },
];

interface DisplayProject {
  id: string;
  title: string;
  daysAgo: string;
  difficulty: "쉬움" | "보통" | "어려움";
  positions: string[];
  deadline: string;
  author?: {
    name: string;
    avatar?: string;
    tier?: number;
  };
}

export default function DashboardView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDashboardProjects();
        if (response.success && response.data) {
          // Transform API data to display format
          console.log(response.data);
          const transformedProjects = response.data.map((project) => ({
            id: project.id,
            title: project.name,
            daysAgo: calculateDaysAgo(project.createdAt),
            difficulty: mapDifficulty(project.difficulty),
            positions: extractPositions(project.positions),
            deadline: formatDate(project.deadline),
          }));
          setProjects(transformedProjects);
        } else {
          // Use mock data as fallback
          setProjects(mockProjects.map((p) => ({ ...p, id: p.id.toString() })));
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects");
        // Use mock data as fallback
        setProjects(mockProjects.map((p) => ({ ...p, id: p.id.toString() })));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper functions for data transformation
  const calculateDaysAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "1일 전";
    return `${diffDays}일 전`;
  };

  const mapDifficulty = (difficulty: string): "쉬움" | "보통" | "어려움" => {
    const lowerDiff = difficulty.toLowerCase();
    if (lowerDiff.includes("easy") || lowerDiff.includes("쉬움")) return "쉬움";
    if (lowerDiff.includes("hard") || lowerDiff.includes("어려움"))
      return "어려움";
    return "보통";
  };

  const extractPositions = (positions: {
    frontend?: string;
    backend?: string;
    ai?: string;
    mobile?: string;
  }): string[] => {
    const result: string[] = [];
    if (positions.frontend && positions.frontend !== "마감")
      result.push("프론트엔드");
    if (positions.backend && positions.backend !== "마감")
      result.push("백엔드");
    if (positions.ai && positions.ai !== "마감") result.push("인공지능");
    if (positions.mobile && positions.mobile !== "마감") result.push("모바일");
    return result.length > 0 ? result : ["프론트엔드", "백엔드"];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC143C]"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">프로젝트가 없습니다</p>
            </div>
          ) : (
            chunk(filteredProjects, 3).map((row, rowIndex) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
