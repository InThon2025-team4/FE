"use client";
import Link from "next/link";
import Image from "next/image";
interface HeaderProps {
  userInitials?: string;
  showUser?: boolean;
}

export function Header({ userInitials = "CN", showUser = true }: HeaderProps) {
  return (
    <header className="h-16 w-full border-b border-[#E5E5E5] flex items-center justify-center bg-white">
      <div className="w-full max-w-[1440px] px-6 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="KUGit Logo" width={24} height={24} />
            <h1 className="text-base font-bold text-[#0A0A0A]">KUGit</h1>
          </div>
        </Link>

        {/* User Avatar */}
        {showUser && (
          <div className="flex items-center gap-2.5">
            <Link href="/mypage">
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="User Avatar"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
