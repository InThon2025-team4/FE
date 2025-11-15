import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProjectCard } from "./projectCard";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full border-b flex items-center justify-center py-6">
        <Link href="/login" className="absolute right-3 top -3">
          <Button>login/signup</Button>
        </Link>
      </div>

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-10 px-16 bg-white dark:bg-black">
        <div className="mb-10">새로운 프로젝트에 참여해보세요!</div>
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
