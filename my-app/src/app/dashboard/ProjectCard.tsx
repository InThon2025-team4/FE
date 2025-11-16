"use client";

import { Badge } from "@/components/ui/badge";
import { TierIcon } from "@/components/TierIcon";

interface ProjectCardProps {
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

export function ProjectCard({
  title,
  daysAgo,
  difficulty,
  positions,
  deadline,
  author,
}: ProjectCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-[#6CDF44] text-white";
      case "보통":
        return "bg-[#CC9D32] text-white";
      case "어려움":
        return "bg-[#DC2626] text-white";
      default:
        return "bg-[#CC9D32] text-white";
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

        {/* Author Profile */}
        {author && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#488FE1] flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-white">
                {author.avatar || author.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-black">
              {author.name}
            </span>
            <TierIcon tier={author.tier || 3} size={16} />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col justify-center gap-1.5">
        {/* Position Badges */}
        <div className="flex items-center gap-3.5 w-[291.33px] h-6">
          {positions.map((position, index) => {
            const getPositionColor = (pos: string) => {
              switch (pos) {
                case "프론트엔드":
                  return "bg-[#0673D3] hover:bg-[#0673D3]/90";
                case "백엔드":
                  return "bg-[#EBB332] hover:bg-[#EBB332]/90";
                case "모바일":
                  return "bg-[#041F9B] hover:bg-[#041F9B]/90";
                case "AI":
                  return "bg-[#771F21] hover:bg-[#771F21]/90";
                default:
                  return "bg-[#771F21] hover:bg-[#771F21]/90";
              }
            };

            return (
              <Badge
                key={index}
                className={`${getPositionColor(
                  position
                )} text-[#FAFAFA] rounded px-2 py-0.5 text-xs font-medium`}
              >
                {position}
              </Badge>
            );
          })}
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
