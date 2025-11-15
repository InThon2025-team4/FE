"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppliedProject } from "./MyPageView";

interface AppliedProjectsSectionProps {
  projects: AppliedProject[];
}

const statusConfig = {
  pending: {
    label: "검토 중",
    color: "bg-[#488FE1] hover:bg-[#488FE1]/90 text-white",
  },
  accepted: {
    label: "승인됨",
    color: "bg-green-600 hover:bg-green-600/90 text-white",
  },
  rejected: {
    label: "거절됨",
    color: "bg-[#DC2626] hover:bg-[#DC2626]/90 text-white",
  },
};

export function OwnedProjectsSection({
  projects,
}: AppliedProjectsSectionProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#505050] text-base">
          아직 지원한 프로젝트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/viewProject/${project.id}`}
          className="block"
        >
          <Card className="h-full hover:shadow-lg hover:border-zinc-300 transition-all duration-200 cursor-pointer">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {project.title}
                </CardTitle>
                <Badge
                  className={`${
                    statusConfig[project.status].color
                  } shrink-0 border-0`}
                >
                  {statusConfig[project.status].label}
                </Badge>
              </div>

              <CardDescription className="text-sm text-zinc-500 line-clamp-2">
                {project.description}
              </CardDescription>

              {/* Project Details */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#505050]">지원일</span>
                  <span className="text-[#0A0A0A] font-medium">
                    {project.appliedDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#505050]">마감일</span>
                  <span className="text-[#0A0A0A] font-medium">
                    {project.deadline}
                  </span>
                </div>
              </div>

              {/* Positions */}
              <div className="flex flex-wrap gap-1.5">
                {project.positions.map((pos) => (
                  <Badge
                    key={pos}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {pos}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
