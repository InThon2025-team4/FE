"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProjectCard } from "./projectCard";
import { useEffect, useState } from "react";
export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLogin(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="h-16 border-b border-[#E5E5E5] flex items-center justify-center">
        <div className="w-full px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded border-2 border-[#DC143C]" />
            <h1 className="text-base font-semibold text-[#0A0A0A]">
              Service Name
            </h1>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="absolute right-3 top -3">
              <Button>login/signup</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full min-w-100 mx-auto py-0 pt-0 pb-[120px] flex flex-col items-center gap-[66px]">
        <div className="mb-10 mt-10">새로운 프로젝트에 참여해보세요!</div>
        <div className="relative w-[50%]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input className="pl-10" placeholder="Search..." />
        </div>
        <ProjectCard></ProjectCard>
      </main>
    </div>
  );
}
