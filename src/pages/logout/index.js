import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // 1. Sign out จาก Supabase
        await supabase.auth.signOut();

        // 2. ลบ token สำรอง (เผื่อหลุดระบบ)
        localStorage.removeItem("sb-dlvptnewdgewaptlqbsa-auth-token");

        // 3. redirect ไปหน้า login
        router.push("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    logout();
  }, [router]);

  return null;
}
