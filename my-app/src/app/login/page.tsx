import { Header } from "@/components/Header";
import { LoginCard } from "./loginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <LoginCard />
      </div>
    </div>
  );
}
