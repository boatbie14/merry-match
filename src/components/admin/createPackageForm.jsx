import { useForm, Controller } from 'react-hook-form';
import UploadPhotoInput from '@/components/form/UploadPhotoPackage';
import { uploadImagesToSupabase } from '@/lib/uploadImagesToSupabase';
import { useState } from 'react';

export default function CreatePackageForm() {
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      packageName: '',
      merryLimit: '10',
      icon: [{ id: 'img1', src: '' }],
      details: [''],
    },
  });

  const [details, setDetails] = useState(['']);

  const handleDetailChange = (index, value) => {
    const updated = [...details];
    updated[index] = value;
    setDetails(updated);
  };

  const handleAddDetail = () => setDetails([...details, '']);

  const handleDeleteDetail = (index) => {
    const updated = details.filter((_, i) => i !== index);
    setDetails(updated);
  };

  const onSubmit = async (data) => {
    console.log("🧪 packageName =", data.packageName); 
    try {
      const imageUrls = await uploadImagesToSupabase(data.icon, 'admin');

      const payload = {
        package_name: data.packageName,
        merry_per_day: Number(data.merryLimit), 
        details: details.filter((d) => d.trim() !== ''),
        iconUrl: imageUrls.imageUrl || '',
      };
      
      console.log('✅ Payload sent to API:', payload);

      const res = await fetch('/api/create-package', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('API Error:', result);
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : JSON.stringify(result.error || result || 'Failed to create package')
        );
      }

      alert('Package created successfully!');
    } catch (error) {
      console.error('Upload or save failed', error);
      setError('icon', { message: 'Upload failed. Please try again.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white mt-6 rounded-xl mx-8 p-8 space-y-8"
    >
      <div className="flex gap-6">
        <div className="w-1/2">
          <label className="block font-medium mb-1">Package name *</label>
          <input
            type="text"
            {...register('packageName', { required: 'Package name is required' })}
            className="border border-gray-300 w-full p-2 rounded"
          />
          {errors.packageName && (
            <p className="text-red-500 text-sm mt-2">{errors.packageName.message}</p>
          )}
        </div>

        <div className="w-1/2">
          <label className="block font-medium mb-1">Merry limit *</label>
          <input
            type="number"
            min="10"
            {...register('merryLimit', {
              required: 'Merry limit is required',
              valueAsNumber: true,
              validate: (value) =>
                !isNaN(value) && Number(value) >= 10 || 'Value must be 10 or higher',
            })}
            className="border border-gray-300 w-full p-2 rounded"
          />
          {errors.merryLimit && (
            <p className="text-red-500 text-sm mt-2">{errors.merryLimit.message}</p>
          )}
        </div>
      </div>

      <Controller
        name="icon"
        control={control}
        render={({ field }) => (
          <UploadPhotoInput value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.icon && (
        <p className="text-red-500 text-sm mt-2">{errors.icon.message}</p>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-600">Package Detail</h2>
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="border border-gray-300 p-2 flex-1 rounded"
              value={detail}
              onChange={(e) => handleDetailChange(i, e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => handleDeleteDetail(i)}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDetail}
          className="bg-pink-100 hover:bg-pink-200 text-[#c4003b] font-medium px-4 py-2 rounded-full cursor-pointer transition duration-200"
        >
          + Add detail
        </button>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="bg-[#c4003b] text-white font-medium px-6 py-2 rounded hover:bg-[#a80032]"
        >
          Create
        </button>
      </div>
    </form>
  );
}
