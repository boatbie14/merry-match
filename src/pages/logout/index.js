// pages/logout.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        localStorage.removeItem("sb-dlvptnewdgewaptlqbsa-auth-token");

        await axios.post("/api/auth/logout");
        router.push("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    logout();
  }, [router]);

  return null; 
}
