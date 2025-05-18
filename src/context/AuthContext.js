import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มทำงาน
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!session?.user || sessionError) {
          setUserInfo(null);
          setCheckingLogin(false);
          return;
        }

        const authUser = session.user;

        // ดึงข้อมูลจากตาราง users โดยใช้ user id
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error loading user profile:', profileError.message);
          setUserInfo(authUser); // fallback แค่ user auth
        } else {
          setUserInfo({ ...authUser, ...profile });
        }
      } catch (err) {
        console.error('Unexpected error loading user:', err);
        setUserInfo(null);
      } finally {
        setCheckingLogin(false);
      }
    }

    loadUser();

    // ฟัง event เมื่อ login/logout เปลี่ยน
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
