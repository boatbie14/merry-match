import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await supabase.auth.signOut(); // ✅ ออกจากระบบผ่าน Supabase
        router.push("/login");         // ✅ เปลี่ยนเส้นทางไปหน้า login
      } catch (err) {
        console.error("Logout failed:", err.message);
      }
    };

    logout();
  }, [router]);

  return null; 
}
