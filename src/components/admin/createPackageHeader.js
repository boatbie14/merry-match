import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatePackageHeader({
  onCreate,
  isSubmitting,
  isEdit = false,
}) {
  const router = useRouter();
  const { id } = router.query;
  const [packageName, setPackageName] = useState('');

  useEffect(() => {
    async function fetchPackageName() {
      if (!isEdit || !id) return;

      const { data, error } = await supabase
        .from('packages')
        .select('package_name')
        .eq('id', id)
        .single();

      if (data?.package_name) {
        setPackageName(data.package_name);
      }
    }

    fetchPackageName();
  }, [id, isEdit]);

  const title = useMemo(() => {
    if (isEdit) {
      return packageName?.trim()
        ? `Edit ‘${packageName}’`
        : 'Edit Package';
    }
    return 'Add Package';
  }, [isEdit, packageName]);


  return (
    <div className="flex justify-between items-center bg-white border-gray-400 px-8 py-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/admin')}
          className="bg-pink-100 hover:bg-pink-200 text-[#c4003b] font-medium px-4 py-2 rounded-full cursor-pointer transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onCreate}
          disabled={isSubmitting}
          className="bg-[#c4003b] hover:bg-[#a8002f] text-white font-medium px-6 py-2 rounded-full cursor-pointer transition duration-200"
        >
          {isSubmitting
            ? isEdit
              ? 'Editing...'
              : 'Creating...'
            : isEdit
            ? 'Edit'
            : 'Create'}
        </button>
      </div>
    </div>
  );
}
