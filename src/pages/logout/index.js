<<<<<<< HEAD
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
=======
// pages/logout.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
>>>>>>> 9c8a149 (refactor(matching-page): rename files and functions for clarity and consistency)

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
<<<<<<< HEAD
        await supabase.auth.signOut(); // ✅ ออกจากระบบผ่าน Supabase
        router.push("/login");         // ✅ เปลี่ยนเส้นทางไปหน้า login
      } catch (err) {
        console.error("Logout failed:", err.message);
=======
        localStorage.removeItem("sb-dlvptnewdgewaptlqbsa-auth-token");

        await axios.post("/api/auth/logout");
        router.push("/login");
      } catch (err) {
        console.error("Logout failed", err);
>>>>>>> 9c8a149 (refactor(matching-page): rename files and functions for clarity and consistency)
      }
    };

    logout();
  }, [router]);

  return null; 
}
