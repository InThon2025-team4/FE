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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle } from "@/lib/auth";

export function SignupCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("알림");
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isSubmitDisabled =
    !email || !password || !confirmPassword || !passwordsMatch;

  const handleSignUp = async () => {
    if (isSubmitDisabled) {
      // 에러 팝업
      setPopupTitle("오류");
      if (!email) {
        setPopupMessage("이메일을 입력해주세요");
      } else if (!password) {
        setPopupMessage("비밀번호를 입력해주세요");
      } else if (!passwordsMatch) {
        setPopupMessage("비밀번호가 일치하지 않습니다.");
      }
      setPopupOpen(true);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp({
        email,
        password,
      });

      if (result.success) {
        setPopupTitle("성공");
        setPopupMessage(
          result.message || "회원가입이 완료되었습니다. 온보딩을 진행해주세요."
        );
        setPopupOpen(true);

        // Redirect to onboarding after showing success message
        setTimeout(() => {
          if (result.user?.id) {
            router.push(
              `/onBoarding?supabaseUid=${result.user.id}&email=${email}`
            );
          }
        }, 1500);
      } else {
        setPopupTitle("오류");
        setPopupMessage(result.message || "회원가입에 실패했습니다.");
        setPopupOpen(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setPopupTitle("오류");
      setPopupMessage("회원가입 중 문제가 발생했습니다.");
      setPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setPopupTitle("오류");
        setPopupMessage(result.message || "Google 회원가입에 실패했습니다.");
        setPopupOpen(true);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setPopupTitle("오류");
      setPopupMessage("Google 회원가입 중 문제가 발생했습니다.");
      setPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{popupTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {popupMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-sm border-none shadow-none ">
        <CardHeader className="text-center">
          <CardTitle>Signup</CardTitle>
          <CardDescription>make your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && (
                  <>
                    {passwordsMatch ? (
                      <p className="text-sm text-emerald-600">
                        비밀번호가 일치합니다.
                      </p>
                    ) : (
                      <p className="text-sm text-red-500">
                        비밀번호가 일치하지 않습니다.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "처리 중..." : "Signup"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            Signup with Google
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
