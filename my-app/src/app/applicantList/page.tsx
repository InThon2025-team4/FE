"use client";

import { useState } from "react";

// Types
interface Applicant {
  id: number;
  name: string;
  positions: string[];
  difficulty: "어려움" | "보통" | "쉬움";
  postedAt: string;
  deadline: string;
  avatar?: string;
}

interface ApplicantCardProps {
  applicant: Applicant;
  isSelected: boolean;
  onClick: () => void;
}

// Position Badge Component
function PositionBadge({ position }: { position: string }) {
  const getPositionColor = (pos: string) => {
    const colorMap: Record<string, string> = {
      프론트엔드: "bg-gradient-to-r from-[#488FE1] to-[#488FE1]",
      백엔드: "bg-gradient-to-r from-[#771F21] to-[#771F21]",
      디자인: "bg-gradient-to-r from-[#999999] to-[#999999]",
    };
    return colorMap[pos] || "bg-gray-500";
  };

  return (
    <div
      className={`${getPositionColor(
        position
      )} px-2 py-1 rounded-[4px] text-white text-[12px] font-medium whitespace-nowrap tracking-[0.18px]`}
    >
      {position}
    </div>
  );
}

// Difficulty Badge Component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "어려움":
        return "bg-[#DC143C]";
      case "보통":
        return "bg-[#E1B848]";
      case "쉬움":
        return "bg-[#488FE1]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`${getDifficultyColor(
        difficulty
      )} px-2 py-1 rounded-full text-white text-[12px] font-medium whitespace-nowrap tracking-[0.18px]`}
    >
      {difficulty}
    </div>
  );
}

// Applicant Card Component
function ApplicantCard({ applicant, isSelected, onClick }: ApplicantCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5E5E5] rounded-[6px] p-6 cursor-pointer transition-all duration-200 hover:border-[#D0D0D0] hover:shadow-sm ${
        isSelected ? "border-[#488FE1] shadow-md" : ""
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[20px] font-semibold text-black leading-[1.2] tracking-[-0.4px]">
            {applicant.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-medium text-[#505050]">
            {applicant.postedAt}
          </span>
          <DifficultyBadge difficulty={applicant.difficulty} />
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-1.5">
        <div className="flex gap-3">
          {applicant.positions.map((position) => (
            <PositionBadge key={position} position={position} />
          ))}
        </div>
        <div className="flex items-center justify-between text-[16px] font-medium text-[#0A0A0A]">
          <span>지원 마감</span>
          <span className="text-[16px] font-medium text-[#505050]">
            {applicant.deadline}
          </span>
        </div>
      </div>
    </div>
  );
}

// Avatar Component
function Avatar({ initials = "CN" }: { initials?: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#488FE1] to-[#2563EB] flex items-center justify-center">
      <span className="text-white text-sm font-medium">{initials}</span>
    </div>
  );
}

// Radius Logo Component
function RadiusLogo() {
  return (
    <div className="w-6 h-6 relative">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="12" cy="12" r="10" stroke="#DC143C" strokeWidth="2" />
      </svg>
    </div>
  );
}

// Main ApplicantList Page
export default function ApplicantList() {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  const applicants: Applicant[] = [
    {
      id: 1,
      name: "프로젝트 제목",
      positions: ["프론트엔드"],
      difficulty: "보통",
      postedAt: "2일 전",
      deadline: "2025. 11. 14",
    },
    {
      id: 2,
      name: "프로젝트 제목",
      positions: ["프론트엔드", "백엔드"],
      difficulty: "보통",
      postedAt: "2일 전",
      deadline: "2025. 11. 14",
    },
    {
      id: 3,
      name: "프로젝트 제목",
      positions: ["프론트엔드", "백엔드"],
      difficulty: "보통",
      postedAt: "2일 전",
      deadline: "2025. 11. 14",
    },
    {
      id: 4,
      name: "프로젝트 제목",
      positions: ["프론트엔드", "백엔드"],
      difficulty: "보통",
      postedAt: "2일 전",
      deadline: "2025. 11. 14",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-[#E5E5E5] flex items-center justify-center">
        <div className="w-full px-[142px] flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <RadiusLogo />
            <h1 className="text-base font-semibold text-[#0A0A0A]">
              Service Name
            </h1>
          </div>

          {/* User Avatar */}
          <Avatar />
        </div>
      </header>

      {/* Main Content */}
      <div className="px-[142px] py-16 flex gap-[15px]">
        {/* Left Column - Applicant List */}
        <div className="w-[685px] max-h-[680px] overflow-y-auto">
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                isSelected={selectedApplicant?.id === applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-[680px] bg-[#E5E5E5]" />

        {/* Right Column - Detail View */}
        <div className="w-[685px] h-[680px] flex items-center justify-center">
          {selectedApplicant ? (
            <div className="text-center">
              <div className="w-[184px] h-[186px] mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="text-6xl">👤</div>
              </div>
              <p className="text-[16px] font-medium text-black">
                {selectedApplicant.name}
              </p>
              <p className="text-[16px] font-medium text-[#505050] mt-2">
                상세 정보를 확인하세요
              </p>
            </div>
          ) : (
            <div className="text-center text-[#505050]">
              <p className="text-[16px] font-medium">지원자를 선택하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
