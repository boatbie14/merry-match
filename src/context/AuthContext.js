import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (!authUser || authError) {
          setUserInfo(null);
          setCheckingLogin(false);
          return;
        }

        // ดึงข้อมูลเพิ่มเติมจากตาราง users โดยใช้ id ที่ได้จาก auth
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.error("Error loading user profile:", profileError.message);
        }

        // รวมข้อมูล auth กับ profile
        setUserInfo({ ...authUser, ...profile });
      } catch (err) {
        console.error("Unexpected error loading user:", err);
        setUserInfo(null);
      } finally {
        setCheckingLogin(false);
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser();
      } else {
        setUserInfo(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = !!userInfo;

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, checkingLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
