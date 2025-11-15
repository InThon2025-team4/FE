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
export function SignupCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isSubmitDisabled =
    !email || !password || !confirmPassword || !passwordsMatch;
  const handleSignUp = () => {
    if (isSubmitDisabled) {
      // 에러 팝업
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
    // 실제 회원가입 로직 실행
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
      <Card className="w-full max-w-sm">
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
          <Button type="button" className="w-full" onClick={handleSignUp}>
            Signup
          </Button>
          <Button variant="outline" className="w-full">
            Signup with Firebase
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
