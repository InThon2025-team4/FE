"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

interface Applicant {
  id: number;
  name: string;
  position: string;
  difficulty: "쉬움" | "보통" | "어려움";
  daysAgo: string;
  deadline: string;
  avatar: string;
}

const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: "사용자 이름",
    position: "프론트엔드",
    difficulty: "보통",
    daysAgo: "2일 전",
    deadline: "2025. 11. 14",
    avatar: "CN",
  },
  {
    id: 2,
    name: "사용자 이름",
    position: "프론트엔드",
    difficulty: "보통",
    daysAgo: "2일 전",
    deadline: "2025. 11. 14",
    avatar: "CN",
  },
  {
    id: 3,
    name: "사용자 이름",
    position: "프론트엔드",
    difficulty: "보통",
    daysAgo: "2일 전",
    deadline: "2025. 11. 14",
    avatar: "CN",
  },
  {
    id: 4,
    name: "사용자 이름",
    position: "프론트엔드",
    difficulty: "보통",
    daysAgo: "2일 전",
    deadline: "2025. 11. 14",
    avatar: "CN",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "쉬움":
      return "bg-[#4CAF50]";
    case "보통":
      return "bg-[#E1B848]";
    case "어려움":
      return "bg-[#DC143C]";
    default:
      return "bg-[#E1B848]";
  }
};

function ApplicantCard({ applicant }: { applicant: Applicant }) {
  return (
    <div className="w-full bg-white border border-[#E5E5E5] rounded-md p-6 flex flex-col justify-between h-[132px]">
      {/* Top Section */}
      <div className="flex flex-col gap-1.5">
        {/* Name and Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-[#0A0A0A]">
              {applicant.avatar}
            </span>
          </div>
          <h3 className="text-base font-semibold text-black">
            {applicant.name}
          </h3>
        </div>

        {/* Subtitle info */}
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-[#505050]">
            {applicant.daysAgo}
          </span>
          <Badge
            className={`${getDifficultyColor(
              applicant.difficulty
            )} text-white rounded-full px-2 py-0.5 text-xs font-medium`}
          >
            {applicant.difficulty}
          </Badge>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1.5">
        {/* Position Badge */}
        <div className="flex items-center gap-3">
          <Badge className="bg-[#771F21] text-white rounded px-2 py-0.5 text-xs font-medium">
            {applicant.position}
          </Badge>
          <Badge className="bg-[#771F21] text-white rounded px-2 py-0.5 text-xs font-medium">
            백엔드
          </Badge>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-[#0A0A0A]">
            지원 마감
          </span>
          <div className="w-[1px] h-[22px] bg-[#D9D9D9]" />
          <span className="text-base font-medium text-[#505050]">
            {applicant.deadline}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicantProfile({ applicant }: { applicant: Applicant }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* Large Avatar */}
      <div className="w-[184px] h-[186px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
        <span className="text-6xl font-bold text-[#0A0A0A]">
          {applicant.avatar}
        </span>
      </div>

      {/* Applicant Info */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-black mb-2">
          {applicant.name}
        </h2>
        <p className="text-base font-medium text-[#505050]">
          상세 정보를 확인하세요
        </p>
      </div>
    </div>
  );
}

export default function ApplicantListPage() {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <Header userInitials="CN" showUser={true} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full px-6 py-6 overflow-hidden">
        <div className="flex gap-6 w-full max-w-[1200px] h-full">
          {/* Left Section - Applicant List */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto border-r border-[#E5E5E5] pr-6 scrollbar-custom">
            <div className="flex flex-col gap-4">
              {mockApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  onClick={() => setSelectedApplicant(applicant)}
                  className={`cursor-pointer transition-all ${
                    selectedApplicant?.id === applicant.id
                      ? "border-l-4 border-[#DC143C] pl-3"
                      : ""
                  }`}
                >
                  <ApplicantCard applicant={applicant} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Applicant Profile */}
          <div className="flex-1 min-w-0 flex items-center justify-center">
            {selectedApplicant ? (
              <ApplicantProfile applicant={selectedApplicant} />
            ) : (
              <div className="text-center text-[#505050]">
                <p className="text-base font-medium">지원자를 선택해주세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
