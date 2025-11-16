"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { signInWithSupabase } from "@/lib/auth";
import { setAuthorizationHeader } from "@/lib/api/projects";

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("알림");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setDialogTitle("오류");
      setDialogMessage("이메일과 비밀번호를 입력해주세요.");
      setDialogOpen(true);
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithSupabase({
        email,
        password,
      });

      if (result.requiresOnboarding || result.onboardingRequired) {
        // New user - redirect to onboarding
        setDialogTitle("환영합니다!");
        setDialogMessage("추가 정보를 입력해주세요.");
        setDialogOpen(true);

        setTimeout(() => {
          router.push(
            `/onboarding?supabaseToken=${encodeURIComponent(result.supabaseAccessToken || "")}&email=${encodeURIComponent(result.email || "")}`
          );
        }, 1500);
      } else if (result.success && result.token) {
        // Existing user - login successful
        setDialogTitle("성공");
        setDialogMessage(result.message || "로그인 성공!");
        setDialogOpen(true);
        setAuthorizationHeader(result.token || "");
        // Redirect after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setDialogTitle("오류");
        setDialogMessage(result.message || "로그인에 실패했습니다.");
        setDialogOpen(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setDialogTitle("오류");
      setDialogMessage("로그인 중 문제가 발생했습니다.");
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="w-[384px] rounded-xl border border-[#E5E5E5] bg-white shadow-sm py-6">
        {/* Card Content */}
        <div className="flex flex-col items-center gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2 px-6">
            <div className="flex items-center justify-center gap-2.5">
              <h2 className="text-xl font-semibold text-[#0A0A0A] leading-[1.2em] tracking-[-0.02em]">
                로그인
              </h2>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full px-6">
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-7">
                {/* Email Input */}
                <div className="flex flex-col gap-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-[#0A0A0A]"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@korea.ac.kr"
                    className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-3">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-[#0A0A0A]"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-auto py-1 px-3 text-base bg-white border border-[#E5E5E5] rounded-md shadow-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Login Button */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full h-9 bg-[#DC143C] hover:bg-[#DC143C]/90 text-[#FAFAFA] text-sm rounded-lg shadow-xs"
                    disabled={loading}
                  >
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
                {/* Signup Link */}
                <div className="flex items-center justify-stretch pt-4">
                  <Link
                    href="/signup"
                    className="flex-1 text-sm text-blue-600 text-center underline hover:underline"
                  >
                    계정이 없으신가요? 간편하게 회원가입하세요!
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
