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
import { Input } from "@/components/ui/input";

interface DevInfoCardProps {
  userInfo: {
    techStack: string[];
    position: string[];
  };
  onComplete: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function DevInfoCard({ userInfo, onComplete, isLoading = false }: DevInfoCardProps) {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [githubId, setGithubId] = useState<string>("");
  const [proficiency, setProficiency] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (!githubId.trim()) {
      alert("GitHub ID를 입력해주세요.");
      return;
    }
    if (!proficiency) {
      alert("개발 능력을 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const onboardingData = {
        name: name.trim(),
        phone: phone.trim(),
        githubId: githubId.trim(),
        techStacks: userInfo.techStack,
        positions: userInfo.position,
        portfolio: portfolio.trim() ? { githubUrl: portfolio.trim() } : undefined,
        proficiency: proficiency, // BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, UNKNOWN
      };

      await onComplete(onboardingData);

      setPopupMessage("회원가입이 완료되었습니다!");
      setPopupOpen(true);
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("온보딩 중 오류가 발생했습니다. 다시 시도해주세요.");
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
              <div className="grid gap-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">전화번호 *</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="githubId">GitHub ID *</Label>
                <Input
                  id="githubId"
                  type="text"
                  placeholder="your-github-id"
                  value={githubId}
                  onChange={(e) => setGithubId(e.target.value)}
                />
              </div>

              <div className="grid gap-2 items-center">
                <Label htmlFor="proficiency">개발 능력 *</Label>

                <Select value={proficiency} onValueChange={setProficiency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="개발 능력을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">BRONZE - 초급</SelectItem>
                    <SelectItem value="SILVER">SILVER - 초중급</SelectItem>
                    <SelectItem value="GOLD">GOLD - 중급</SelectItem>
                    <SelectItem value="PLATINUM">PLATINUM - 중고급</SelectItem>
                    <SelectItem value="DIAMOND">DIAMOND - 고급</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="portfolio">포트폴리오 링크 (선택)</Label>
                <Input
                  id="portfolio"
                  type="text"
                  placeholder="https://github.com/your-id"
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
            disabled={loading || isLoading}
          >
            {loading || isLoading ? "가입 중..." : "가입 완료"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
