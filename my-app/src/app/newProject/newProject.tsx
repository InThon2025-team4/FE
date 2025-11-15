"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewProjectView() {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    duration: "",
    weeklyHours: "",
    deadline: "",
    description: "",
    position: "",
    frontendCount: 1,
  });

  const handleIncrement = () => {
    setFormData((prev) => ({
      ...prev,
      frontendCount: prev.frontendCount + 1,
    }));
  };

  const handleDecrement = () => {
    if (formData.frontendCount > 0) {
      setFormData((prev) => ({
        ...prev,
        frontendCount: prev.frontendCount - 1,
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Project data:", formData);
    // TODO: Submit to backend API
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Scrollbar Indicator (positioned absolute as in Figma) */}
      <div className="fixed right-3 top-[286px] w-[9px] h-[468px] rounded-full bg-[#E5E5E5]" />

      {/* Main Content */}
      <main className="w-full max-w-[574px] mx-auto pt-[71px] pb-[120px]">
        <div className="flex flex-col items-center gap-[34px]">
          {/* Header Section */}
          <div className="w-full flex flex-col items-center gap-7">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-2">
              {/* Gallery Icon */}
              <div className="w-6 h-6 flex items-center justify-center rounded-lg">
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current text-[#0A0A0A]"
                  strokeWidth="1"
                >
                  <path d="M3 2L3 18M15 2L15 18M3 10H15M3 6H15M3 14H15" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[#0A0A0A] leading-[1.4em]">
                새 프로젝트 만들기
              </h1>
            </div>

            {/* Form Fields */}
            <div className="w-full flex flex-col gap-6">
              {/* Project Title */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  프로젝트 제목
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="프로젝트 제목을 입력하세요"
                  className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs"
                />
              </div>

              {/* Project Start Date */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  프로젝트 시작일
                </Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  placeholder="프로젝트 제목을 입력하세요"
                  className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs"
                />
              </div>

              {/* Expected Duration */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  예상 기간
                </Label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="프로젝트 제목을 입력하세요"
                  className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs"
                />
              </div>

              {/* Weekly Hours */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  주당 투자 시간
                </Label>
                <Input
                  value={formData.weeklyHours}
                  onChange={(e) =>
                    setFormData({ ...formData, weeklyHours: e.target.value })
                  }
                  placeholder="프로젝트 제목을 입력하세요"
                  className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs"
                />
              </div>

              {/* Recruitment Deadline */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  모집 마감일
                </Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  placeholder="프로젝트 제목을 입력하세요"
                  className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs"
                />
              </div>

              {/* Project Description */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  프로젝트 설명
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="프로젝트 설명을 입력하세요"
                  className="h-[76px] resize-y bg-white border border-[#E5E5E5] rounded-lg shadow-xs text-sm p-2"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-px border-t border-[#E5E5E5]" />

              {/* Position Select */}
              <div className="w-full flex flex-col gap-3">
                <Label className="text-sm font-medium text-[#0A0A0A]">
                  포지션
                </Label>
                <div className="relative">
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full h-auto py-[7.5px] px-3 pr-8 text-sm bg-white border border-[#D4D4D4] rounded-lg shadow-xs appearance-none text-[#737373]"
                  >
                    <option value="">포지션을 선택하세요</option>
                    <option value="frontend">프론트엔드</option>
                    <option value="backend">백엔드</option>
                    <option value="ai">인공지능</option>
                    <option value="mobile">모바일</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#737373"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Frontend Recruitment Count */}
              <div className="w-[574px] h-auto flex items-center justify-center gap-[170px]">
                <Label className="w-[120px] flex justify-end text-sm font-medium text-[#0A0A0A]">
                  프론트엔드 모집 인원
                </Label>
                <div className="flex items-center gap-[13px]">
                  <div className="w-[87px] h-7 flex items-center bg-white border border-[#E5E5E5] rounded-md shadow-xs">
                    {/* Minus Button */}
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-4 flex items-center justify-center h-full"
                    >
                      <svg
                        width="10"
                        height="2"
                        viewBox="0 0 10 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 1H10" stroke="#0A0A0A" strokeWidth="1" />
                      </svg>
                    </button>

                    {/* Input */}
                    <div className="flex-1 h-full flex items-center justify-center border-x border-[#E5E5E5] px-3">
                      <span className="text-sm text-[#0A0A0A]">
                        {formData.frontendCount}
                      </span>
                    </div>

                    {/* Plus Button */}
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-4 flex items-center justify-center h-full"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 0V10M0 5H10"
                          stroke="#E5E5E5"
                          strokeWidth="1"
                        />
                      </svg>
                    </button>
                  </div>
                  <Label className="w-[52px] text-sm font-medium text-[#0A0A0A]">
                    명
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full h-9 bg-[#DC143C] hover:bg-[#DC143C]/90 text-[#FAFAFA] text-base font-medium rounded-lg shadow-xs"
              >
                프로젝트 생성하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
