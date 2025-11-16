"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TierIcon } from "@/components/TierIcon";
import type { UserProfile } from "./MyPageView";

interface UserProfileSectionProps {
  profile: UserProfile;
}

export function UserProfileSection({ profile }: UserProfileSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0 overflow-hidden">
          <Image
            src="/logo.png"
            alt={profile.name}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold text-black">
              {profile.name}
            </h3>
            <TierIcon tier={profile.tier || "GOLD"} />
          </div>
          <p className="text-base text-[#505050]">{profile.email}</p>
          {profile.bio && (
            <p className="text-sm text-[#0A0A0A] mt-2">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#0A0A0A]">기술 스택</h4>
        <div className="flex flex-wrap gap-2">
          {profile.techStack.length > 0 ? (
            profile.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {tech}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-[#505050]">
              등록된 기술 스택이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* Position */}
      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#0A0A0A]">포지션</h4>
        <div className="flex flex-wrap gap-2">
          {profile.position.length > 0 ? (
            profile.position.map((pos) => (
              <Badge
                key={pos}
                variant="default"
                className="px-3 py-1 text-sm bg-[#488FE1] hover:bg-[#488FE1]/90"
              >
                {pos}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-[#505050]">등록된 포지션이 없습니다.</p>
          )}
        </div>
      </div>

      {/* Portfolio */}
      {profile.portfolio && (
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-[#0A0A0A]">포트폴리오</h4>
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#488FE1] hover:underline"
          >
            {profile.portfolio}
          </a>
        </div>
      )}
    </div>
  );
}
