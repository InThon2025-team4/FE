import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ProjectCard() {
  return (
    <Link href="/project/detail" className="block">
      <Card
        className="
          w-[260px] 
          h-[160px]
          m-6 
          p-6
          rounded-xl
          border
          bg-white
          shadow-sm
          hover:shadow-lg
          hover:border-zinc-300
          dark:bg-zinc-900
          transition-all 
          duration-200
          cursor-pointer 
          flex flex-col justify-center
        "
      >
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold">Project Name</CardTitle>
          <CardDescription className="text-sm text-zinc-500">
            프로젝트 설명
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
