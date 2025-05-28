import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import AdminSidebar from '@/components/AdminSidebar'
import PackageTable from '@/components/PackageTable'

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {

  const checkAdmin = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      router.push('/login');
      return;
    }

    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (userDataError) {
      console.error('Error fetching user role:', userDataError.message);
      router.push('/login');
      return;
    }

    if (userData?.user_role !== 'admin') {
      router.push('/');
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  checkAdmin();
}, [router]);

if (!isAdmin) return null;
    return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <PackageTable />
      </main>
    </div>
  )
}
