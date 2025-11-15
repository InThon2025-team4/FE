"use client";
import Link from "next/link";
interface HeaderProps {
  userInitials?: string;
  showUser?: boolean;
}

export function Header({ userInitials = "CN", showUser = true }: HeaderProps) {
  return (
    <header className="h-16 w-full border-b border-[#E5E5E5] flex items-center justify-center bg-white">
      <div className="w-full max-w-[1440px] px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/dashboard">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded border-2 border-[#DC143C]" />
            <h1 className="text-base font-bold text-[#0A0A0A]">KUGit</h1>
          </div>
        </Link>

        {/* User Avatar */}
        {showUser && (
          <div className="flex items-center gap-2.5">
            <Link href="/mypage">
              <div className="w-10 h-10 rounded-full bg-[#488FE1] flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {userInitials}
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
