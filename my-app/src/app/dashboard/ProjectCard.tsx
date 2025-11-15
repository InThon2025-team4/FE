"use client";

import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  title: string;
  daysAgo: string;
  difficulty: "쉬움" | "보통" | "어려움";
  positions: string[];
  deadline: string;
}

export function ProjectCard({
  title,
  daysAgo,
  difficulty,
  positions,
  deadline,
}: ProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-[#4CAF50] text-white";
      case "보통":
        return "bg-[#E1B848] text-white";
      case "어려움":
        return "bg-[#DC143C] text-white";
      default:
        return "bg-[#E1B848] text-white";
    }
  };

  return (
    <div className="flex flex-col justify-between items-center p-6 bg-white border border-[#E5E5E5] rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer h-[198px]">
      {/* Top Section */}
      <div className="flex flex-col justify-center gap-1.5 w-[291.33px] h-[59px]">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-semibold text-black leading-[1.2em] tracking-[-0.02em]">
            {title}
          </h3>
        </div>

        {/* Date and Difficulty Badge */}
        <div className="flex justify-between items-center gap-1.5">
          <span className="text-base font-medium text-[#505050]">
            {daysAgo}
          </span>
          <Badge
            className={`${getDifficultyColor(
              difficulty
            )} rounded-full px-2 py-0.5 text-xs font-medium`}
          >
            {difficulty}
          </Badge>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col justify-center gap-1.5">
        {/* Position Badges */}
        <div className="flex items-center gap-3.5 w-[291.33px] h-6">
          {positions.map((position, index) => (
            <Badge
              key={index}
              className="bg-[#771F21] hover:bg-[#771F21]/90 text-[#FAFAFA] rounded px-2 py-0.5 text-xs font-medium"
            >
              {position}
            </Badge>
          ))}
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2.5 w-[291.33px] h-6">
          <span className="text-base font-medium text-[#0A0A0A]">
            지원 마감
          </span>
          <div className="w-[9px] h-[22px] border-l border-[#D9D9D9]" />
          <span className="text-base font-medium text-[#505050] w-[95px]">
            {deadline}
          </span>
        </div>
      </div>
    </div>
  );
}
