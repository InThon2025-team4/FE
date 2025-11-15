"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitOnboarding } from "@/lib/api/projects";
import { Input } from "@/components/ui/input";

interface DevInfoCardProps {
  userInfo: {
    techStack: string[];
    position: string[];
  };
}

export function DevInfoCard({ userInfo }: DevInfoCardProps) {
  const router = useRouter();
  const [proficiency, setProficiency] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const handleSubmit = async () => {
    if (!proficiency) {
      alert("개발 능력을 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const onboardingData = {
        techStack: userInfo.techStack,
        position: userInfo.position,
        portfolio: portfolio === "" ? undefined : portfolio,
        proficiency: parseInt(proficiency),
      };

      const result = await submitOnboarding(onboardingData);

      if (result.success) {
        setPopupMessage("회원가입이 완료되었습니다!");
        setPopupOpen(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        alert(result.message || "온보딩 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("온보딩 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">알림</DialogTitle>
            <DialogDescription className="text-center">
              {popupMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-sm border-none shadow-none">
        <CardHeader className="text-left">
          <CardTitle>프로필 정보 입력</CardTitle>
          <CardDescription>팀 매칭을 위한 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 items-center">
                <div className="flex items-center">
                  <Label htmlFor="proficiency">개발 능력</Label>
                </div>

                <Select value={proficiency} onValueChange={setProficiency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="개발 능력을 선택하세요 (1-5)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - 초급</SelectItem>
                    <SelectItem value="2">2 - 초중급</SelectItem>
                    <SelectItem value="3">3 - 중급</SelectItem>
                    <SelectItem value="4">4 - 중고급</SelectItem>
                    <SelectItem value="5">5 - 고급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="portfolio">포트폴리오 링크 (선택)</Label>
                </div>
                <Input
                  id="portfolio"
                  type="text"
                  placeholder="https://example.com"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full bg-[var(--color-red)]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "가입 중..." : "가입 완료"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
