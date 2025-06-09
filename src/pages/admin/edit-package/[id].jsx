// pages/admin/edit-package/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';
import AdminSidebar from '@/components/AdminSidebar';
import CreatePackageHeader from '@/components/admin/createPackageHeader';
import CreatePackageForm from '@/components/admin/createPackageForm';
import { getPackageById } from '@/lib/supabase/packages';
import { supabase } from "@/lib/supabaseClient";

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = router.query;

  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadPackage() {
      try {
        const data = await getPackageById(id);
        if (!data) {
          throw new Error('ไม่พบแพ็กเกจ');
        }

        const newInitialData = {
          package_name: data.package_name || '',
          merry_per_day:
            data.merry_per_day === null ? 'ไม่จำกัด' : data.merry_per_day.toString(),
          icon_url: data.icon_url || '',
          details: data.details || [''], 
          price: data.price?.toString() || '',
        };

        setInitialData((prev) =>
          isEqual(prev, newInitialData) ? prev : newInitialData
        );
      } catch (error) {
        console.error('❌ ไม่พบแพ็กเกจ:', error.message);
        alert('ไม่พบแพ็กเกจที่ต้องการแก้ไข');
        router.push('/admin/packages');
      } finally {
        setIsLoading(false);
      }
    }

    loadPackage();
  }, [id]);

  const handleUpdate = async (formData) => {
  const name = formData.packageName?.trim();
  const merryLimitRaw = formData.merryLimit;
  const merryLimit =
    merryLimitRaw === 'ไม่จำกัด' || merryLimitRaw === '' ? null : Number(merryLimitRaw);
  const icon =
    (Array.isArray(formData.icon) && formData.icon.length > 0 && formData.icon[0].src) ||
    formData.icon_url ||
    '';
  const details = formData.details || [];

  if (!name || !icon || (merryLimit !== null && (isNaN(merryLimit) || merryLimit < 10))) {
    console.log('กรุณากรอกข้อมูลให้ครบ...'+ name + ' ' + icon + ' ' + merryLimit);
    return;
  }

  setIsSubmitting(true);

  const { error } = await supabase
    .from('packages')
    .update({
      package_name: name,
      merry_per_day: merryLimit,
      icon_url: icon,
      updated_at: new Date().toISOString(),
      details,
      price,
    })
    .eq('id', id);

  setIsSubmitting(false);

  if (error) {
    console.error('❌ อัปเดตแพ็กเกจล้มเหลว:', error.message);
    alert('ไม่สามารถอัปเดตแพ็กเกจได้');
  } else {
    alert('อัปเดตแพ็กเกจเรียบร้อยแล้ว');
    router.push('/admin/packages');
  }
};


  if (isLoading || !initialData) {
    return <p className="p-6">กำลังโหลด...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1">
        <CreatePackageHeader
          onCreate={() => document.querySelector('form')?.requestSubmit()}
          isSubmitting={isSubmitting}
          isEdit={true}
          package_name={initialData.package_name}
        />
        <CreatePackageForm
          key={id}
          initialData={initialData}
          onSubmit={handleUpdate}
          isEditMode={true}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}
