import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        router.push('/');
      } else {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <h1>👑 Admin Dashboard</h1>;
}
