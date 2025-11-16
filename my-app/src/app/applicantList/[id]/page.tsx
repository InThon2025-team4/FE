"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { TierIcon } from "@/components/TierIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateApplicationStatus } from "@/lib/api/projects";

interface Applicant {
  id: string;
  userId: string;
  name: string;
  email: string;
  position: string;
  introduction: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  daysAgo: string;
  avatar: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  techStack: string[];
  portfolio?: string;
}

type PositionFilter = "프론트엔드" | "백엔드" | "AI" | "모바일";

const mockApplicants: Applicant[] = [
  {
    id: "1",
    userId: "user1",
    name: "신청자 이름",
    email: "user1@example.com",
    position: "프론트엔드",
    introduction: "예시 한줄소개입니다.",
    status: "pending",
    appliedAt: "2025-11-14T10:00:00Z",
    daysAgo: "2일 전",
    avatar: "CN",
    tier: "GOLD",
    techStack: ["Javascript", "React", "TypeScript"],
    portfolio: "link.example.com",
  },
  {
    id: "2",
    userId: "user2",
    name: "신청자 이름",
    email: "user2@example.com",
    position: "백엔드",
    introduction: "백엔드 개발 경험이 풍부합니다.",
    status: "pending",
    appliedAt: "2025-11-14T10:00:00Z",
    daysAgo: "2일 전",
    avatar: "JD",
    tier: "PLATINUM",
    techStack: ["Node.js", "Express", "MongoDB"],
    portfolio: "github.com/example",
  },
  {
    id: "3",
    userId: "user3",
    name: "신청자 이름",
    email: "user3@example.com",
    position: "프론트엔드",
    introduction: "UI/UX에 관심이 많습니다.",
    status: "pending",
    appliedAt: "2025-11-14T10:00:00Z",
    daysAgo: "2일 전",
    avatar: "KS",
    tier: "SILVER",
    techStack: ["Vue.js", "Nuxt.js", "CSS"],
  },
  {
    id: "4",
    userId: "user4",
    name: "신청자 이름",
    email: "user4@example.com",
    position: "AI",
    introduction: "머신러닝 전문가입니다.",
    status: "pending",
    appliedAt: "2025-11-14T10:00:00Z",
    daysAgo: "3일 전",
    avatar: "LM",
    tier: "DIAMOND",
    techStack: ["Python", "TensorFlow", "PyTorch"],
    portfolio: "kaggle.com/example",
  },
];

const getPositionColor = (position: string) => {
  switch (position) {
    case "프론트엔드":
      return "#0673D3";
    case "백엔드":
      return "#EBB332";
    case "모바일":
      return "#041F9B";
    case "AI":
      return "#771F21";
    default:
      return "#0673D3";
  }
};

function ApplicantCard({ applicant }: { applicant: Applicant }) {
  return (
    <div className="w-full bg-white border border-[#E5E5E5] rounded-md shadow-md p-6 flex flex-col justify-between h-[139px]">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        {/* Name and Avatar */}
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0 overflow-hidden relative">
            <Image
              src="/logo.png"
              alt={applicant.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-black">{applicant.name}</h3>
        </div>

        {/* Tier Badge */}
        <TierIcon tier={applicant.tier} />
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Position Badge */}
        <div className="flex items-center gap-[15px]">
          <Badge
            className="text-white rounded px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: getPositionColor(applicant.position) }}
          >
            {applicant.position}
          </Badge>
        </div>

        {/* Days Ago */}
        <span className="text-base font-medium text-[#505050]">
          {applicant.daysAgo}
        </span>
      </div>
    </div>
  );
}

function ApplicantProfile({
  applicant,
  onAccept,
  onReject,
}: {
  applicant: Applicant;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-10 py-[101px] w-full max-w-[560px]">
      {/* Large Avatar and Name */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-[184px] h-[186px] rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0 overflow-hidden relative">
          <Image
            src="/logo.png"
            alt={applicant.name}
            width={184}
            height={186}
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-3 justify-center">
          <h2 className="text-2xl font-semibold text-black text-center">
            {applicant.name}
          </h2>
          <TierIcon tier={applicant.tier} />
        </div>
      </div>

      {/* Applicant Details */}
      <div className="flex flex-col gap-4 w-full px-12">
        {/* Tech Stack */}
        <div className="flex flex-col items-center gap-0">
          <h3 className="text-base font-medium text-black w-full text-left">
            기술 스택
          </h3>
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {applicant.techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-black/5 rounded-full px-6 py-2.5 text-sm text-[#0A0A0A]"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        {applicant.portfolio && (
          <div className="flex flex-col gap-3.5 h-[46px]">
            <h3 className="text-base font-medium text-black">포트폴리오</h3>
            <div className="px-4">
              <p className="text-sm text-black h-[26px] flex items-center justify-center">
                {applicant.portfolio}
              </p>
            </div>
          </div>
        )}

        {/* Introduction */}
        <div className="flex flex-col gap-3.5 h-[46px]">
          <h3 className="text-base font-medium text-black">한줄소개</h3>
          <div className="px-4">
            <p className="text-sm text-black h-[26px] flex items-center justify-center">
              {applicant.introduction}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 px-[132px] w-full">
        <button
          onClick={onReject}
          className="flex-1 border border-[#E4E4E7] rounded-md px-4 py-2.5 text-base font-medium text-[#18181B] hover:bg-gray-50 transition-colors"
        >
          신청 거절
        </button>
        <button
          onClick={onAccept}
          className="flex-1 bg-[#DC143C] rounded-md px-4 py-2.5 text-base font-medium text-white hover:bg-[#B01030] transition-colors"
        >
          신청 수락
        </button>
      </div>
    </div>
  );
}

export default function ApplicantListPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [selectedFilters, setSelectedFilters] = useState<Set<PositionFilter>>(
    new Set()
  );
  const [alertConfig, setAlertConfig] = useState<{
    open: boolean;
    type: "accept" | "reject" | "success" | null;
    applicant: Applicant | null;
  }>({
    open: false,
    type: null,
    applicant: null,
  });

  // Filter applicants based on selected position filters
  const filteredApplicants = useMemo(() => {
    if (selectedFilters.size === 0) {
      return mockApplicants;
    }
    return mockApplicants.filter((applicant) =>
      selectedFilters.has(applicant.position as PositionFilter)
    );
  }, [selectedFilters]);

  const toggleFilter = (filter: PositionFilter) => {
    setSelectedFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  const handleAcceptClick = () => {
    if (!selectedApplicant) return;
    setAlertConfig({
      open: true,
      type: "accept",
      applicant: selectedApplicant,
    });
  };

  const handleRejectClick = () => {
    if (!selectedApplicant) return;
    setAlertConfig({
      open: true,
      type: "reject",
      applicant: selectedApplicant,
    });
  };

  const handleConfirmAction = async () => {
    if (!alertConfig.applicant || !alertConfig.type) return;

    const status = alertConfig.type === "accept" ? "accepted" : "rejected";
    const result = await updateApplicationStatus(
      projectId,
      alertConfig.applicant.userId,
      status
    );

    if (result.success) {
      // Show success alert
      setAlertConfig({
        open: true,
        type: "success",
        applicant: alertConfig.applicant,
      });
    } else {
      // Handle error
      console.error("Failed to update application status:", result.message);
      setAlertConfig({ open: false, type: null, applicant: null });
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig({ open: false, type: null, applicant: null });
  };

  const positions: PositionFilter[] = ["프론트엔드", "백엔드", "AI", "모바일"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header userInitials="CN" showUser={true} />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-start gap-[30px] px-[142px] py-[42px]">
        {/* Left Section - Filter Tags and Applicant List */}
        <div className="flex flex-col items-end gap-5 w-[385px]">
          {/* Filter Tags */}
          <div className="flex justify-center items-center gap-2.5 px-2.5 py-2.5 w-full h-[50px]">
            {positions.map((position) => {
              const isSelected = selectedFilters.has(position);
              return (
                <button
                  key={position}
                  onClick={() => toggleFilter(position)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm transition-all shadow-md whitespace-nowrap ${
                    isSelected
                      ? "bg-[#DC143C] text-[#F5F5F5]"
                      : "bg-black/20 text-[#757575]"
                  }`}
                >
                  {position}
                </button>
              );
            })}
          </div>

          {/* Applicant Cards */}
          <div className="flex flex-col gap-5 w-full px-3 py-4 max-h-[700px] overflow-y-auto scrollbar-custom">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
                className={`cursor-pointer transition-all ${
                  selectedApplicant?.id === applicant.id ? "opacity-100" : ""
                }`}
              >
                <ApplicantCard applicant={applicant} />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-0.5 h-[774px] bg-[#E5E5E5]" />

        {/* Right Section - Applicant Profile */}
        <div className="flex-1 flex items-start justify-center min-h-[774px]">
          {selectedApplicant ? (
            <ApplicantProfile
              applicant={selectedApplicant}
              onAccept={handleAcceptClick}
              onReject={handleRejectClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-base font-medium text-[#505050]">
                지원자를 선택해주세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Alert */}
      <AlertDialog
        open={alertConfig.open && alertConfig.type !== "success"}
        onOpenChange={(open) => {
          if (!open) handleCloseAlert();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertConfig.type === "accept"
                ? "신청을 수락하시겠습니까?"
                : "신청을 거절하시겠습니까?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.type === "accept"
                ? `${alertConfig.applicant?.name}님의 신청을 수락합니다.`
                : `${alertConfig.applicant?.name}님의 신청을 거절합니다.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlert}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Alert */}
      <AlertDialog
        open={alertConfig.open && alertConfig.type === "success"}
        onOpenChange={(open) => {
          if (!open) handleCloseAlert();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>처리 완료</AlertDialogTitle>
            <AlertDialogDescription>
              신청이 성공적으로 처리되었습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseAlert}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
