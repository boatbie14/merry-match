import AdminSidebar from '@/components/AdminSidebar';
import CreatePackageHeader from '@/components/admin/createPackageHeader';
import CreatePackageForm from '@/components/admin/createPackageForm';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatePackagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitFormRef = useRef();

  const handleCreate = async ({ package_name, merry_per_day, price, details, price_id, }) => {
    if (!package_name || merry_per_day === undefined) {
      alert('กรอกข้อมูลให้ครบ');
      return;
    }

    setIsSubmitting(true);

    const { error: insertError } = await supabase.from('packages').insert([
      {
        package_name,
        merry_per_day,
        price: parseFloat(price) || 0,
        details,
        price_id,
      },
    ]);

    if (insertError) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
      setIsSubmitting(false);
      return;
    }
    
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <CreatePackageHeader
          onCreate={() => submitFormRef.current?.()}
          isSubmitting={isSubmitting}
        />
        <CreatePackageForm
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          exposeSubmit={(submitFn) => {
            submitFormRef.current = submitFn;
          }}
        />
      </main>
    </div>
  );
}
