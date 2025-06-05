import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '@/components/AdminSidebar';
import CreatePackageHeader from '@/components/admin/createPackageHeader';
import CreatePackageForm from '@/components/admin/CreatePackageForm';
import { supabase } from '@/lib/supabaseClient';

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadPackage() {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ ไม่พบแพ็กเกจ:', error.message);
      } else {
        setPkg(data);
      }
      setLoading(false);
    }

    loadPackage();
  }, [id]);

  const handleUpdate = async ({ package_name, merry_per_day, icon_url, details }) => {
    if (!package_name || (!icon_url && !pkg.icon_url) || (merry_per_day === undefined)) {
      alert('กรอกข้อมูลให้ครบ.... ' + package_name + ' ' + merry_per_day + ' ' + icon_url);
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase
      .from('packages')
      .update({
        package_name,
        merry_per_day,
        icon_url,
        details,
      })
      .eq('id', id);

    if (updateError) {
      alert('เกิดข้อผิดพลาดในการอัปเดต');
      setIsSubmitting(false);
      return;
    }

    alert('อัปเดตแพ็กเกจสำเร็จ!');
    router.push('/admin');
  };


  if (loading) return <p className="p-4">กำลังโหลด...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <CreatePackageHeader
          onCreate={() => document.querySelector('form').requestSubmit()}
          isSubmitting={isSubmitting}
          isEdit
        />
        <CreatePackageForm
          onSubmit={handleUpdate}
          initialData={pkg}
          isEditMode
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}
