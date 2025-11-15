"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

interface ApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  availablePositions: {
    label: string;
    value: string;
    available: boolean;
  }[];
  onSuccess?: () => void;
}

export function ApplyModal({
  open,
  onOpenChange,
  projectId,
  availablePositions,
  onSuccess,
}: ApplyModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [introduction, setIntroduction] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleApply = async () => {
    if (!selectedPosition) {
      alert("포지션을 선택해주세요.");
      return;
    }

    if (!introduction.trim()) {
      alert("자기소개를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_EXCHANGE_URL;

      // Call backend API to create application
      await axios.post(`${serverUrl}/api/applications`, {
        projectId,
        position: selectedPosition,
        introduction: introduction.trim(),
      });

      // Close the apply modal
      onOpenChange(false);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      setSelectedPosition("");
      setIntroduction("");
    } catch (error) {
      console.error("Application error:", error);
      alert("지원 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      {/* Apply Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              프로젝트 지원하기
            </DialogTitle>
            <DialogDescription>
              지원할 포지션을 선택하고 자기소개를 작성해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {/* Position Selection */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="position" className="text-base font-medium">
                포지션 선택 *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {availablePositions.map((position) => (
                  <button
                    key={position.value}
                    type="button"
                    disabled={!position.available || loading}
                    onClick={() => setSelectedPosition(position.value)}
                    className={`
                      px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                      ${
                        selectedPosition === position.value
                          ? "border-[#771F21] bg-[#771F21] text-white"
                          : position.available
                          ? "border-[#E5E5E5] bg-white text-[#0A0A0A] hover:border-[#771F21]"
                          : "border-[#E5E5E5] bg-[#F5F5F5] text-[#A3A3A3] cursor-not-allowed"
                      }
                    `}
                  >
                    {position.label}
                    {!position.available && " (마감)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Self Introduction */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="introduction" className="text-base font-medium">
                자기소개 *
              </Label>
              <Textarea
                id="introduction"
                placeholder="자신을 소개하고 프로젝트에 기여할 수 있는 부분을 작성해주세요."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                disabled={loading}
                className="min-h-[150px] resize-none border-[#E5E5E5] focus-visible:ring-[#771F21]"
              />
              <span className="text-xs text-[#737373]">
                {introduction.length} / 500자
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-[#E5E5E5]"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="bg-[#771F21] hover:bg-[#771F21]/90 text-white"
            >
              {loading ? "지원 중..." : "지원하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              지원 완료
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              프로젝트에 성공적으로 지원되었습니다!
              <br />
              결과는 마이페이지에서 확인하실 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={handleSuccessDialogClose}
              className="bg-[#771F21] hover:bg-[#771F21]/90 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
