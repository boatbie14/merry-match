import AdminSidebar from '@/components/AdminSidebar';
import CreatePackageHeader from '@/components/admin/createPackageHeader';
import CreatePackageForm from '@/components/admin/createPackageForm';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatePackagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async ({ packageName, merryLimit, iconFile, details }) => {
    if (!packageName || !iconFile || !merryLimit) {
      alert('กรอกข้อมูลให้ครบ');
      return;
    }

    setIsSubmitting(true);

    const fileExt = iconFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('package-icons')
      .upload(fileName, iconFile);

    if (uploadError) {
      alert('อัปโหลดรูปไม่สำเร็จ');
      setIsSubmitting(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('package-icons').getPublicUrl(fileName);

    const { error: insertError } = await supabase.from('merry_packages').insert([
      {
        package_name: packageName,
        merry_per_day: merryLimit === 'ไม่จำกัด' ? null : parseInt(merryLimit),
        icon_url: publicUrl,
        details,
      },
    ]);

    if (insertError) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
      setIsSubmitting(false);
      return;
    }

    alert('สร้างแพ็กเกจสำเร็จ!');
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <CreatePackageHeader onCreate={() => document.querySelector('form').requestSubmit()} isSubmitting={isSubmitting} />
        <CreatePackageForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
