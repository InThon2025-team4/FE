"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          router.push("/login?error=authentication_failed");
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log("Authentication successful:", data.session.user);

          // Check if user profile exists, if not create one
          const { error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (profileError && profileError.code === "PGRST116") {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: data.session.user.id,
                  email: data.session.user.email,
                  name:
                    data.session.user.user_metadata?.name ||
                    data.session.user.email?.split("@")[0],
                  created_at: new Date().toISOString(),
                },
              ]);

            if (insertError) {
              console.warn("Profile creation warning:", insertError.message);
            }
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          // No session found
          router.push("/login?error=no_session");
        }
      } catch (err) {
        console.error("Callback error:", err);
        router.push("/login?error=unexpected_error");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC143C]"></div>
        <p className="mt-4 text-gray-600">인증 처리 중...</p>
      </div>
    </div>
  );
}
