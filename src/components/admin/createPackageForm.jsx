import { useForm, Controller, useFieldArray } from 'react-hook-form';
import UploadPhotoInput from '@/components/form/UploadPhotoPackage';
import { uploadImagesToSupabase } from '@/lib/uploadImagesToSupabase';
import { useEffect } from 'react';

export default function CreatePackageForm({
  initialData = null,
  isEditMode = false,
  onSubmit: onSubmitProp = async (data) => {
    console.warn('❌ onSubmit was not provided:', data);
  },
  isSubmitting = false,
  exposeSubmit,
}) {
  const {
    control,
    handleSubmit,
    setError,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      packageName: '',
      merryLimit: '10',
      price: '',
      icon: [{ id: 'img1', src: '' }],
      details: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  useEffect(() => {
    if (initialData) {
      reset({
        packageName: initialData.package_name || '',
        merryLimit:
          initialData.merry_per_day === null
            ? 'ไม่จำกัด'
            : String(initialData.merry_per_day),
        price: String(initialData.price || ''),
        icon: initialData.icon_url
          ? [{ id: 'existing-icon', src: initialData.icon_url }]
          : [{ id: 'img1', src: '' }],
        details:
          initialData.details?.map((d) => ({ value: d })) || [{ value: '' }],
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (exposeSubmit) {
      exposeSubmit(() => handleSubmit(handleFormSubmit)());
    }
  }, [exposeSubmit, handleSubmit]);

  const handleFormSubmit = async (data) => {
    console.log('🟢 raw data from form:', data);

    const allFilled = data.details.every((d) => d.value.trim() !== '');
    if (!allFilled) {
      setError('details', { message: 'กรุณากรอกรายละเอียดให้ครบทุกช่อง' });
      return;
    }

    try {
      const uploadedIcon = data.icon?.[0];
      const isNewImage = uploadedIcon && !uploadedIcon.src.startsWith('https://');

      let iconUrl = initialData?.icon_url || '';

      if (isNewImage) {
        const imageUrls = await uploadImagesToSupabase(data.icon, 'admin');
        iconUrl = imageUrls.profile_image_url || '';
      }

      if (!iconUrl) {
        alert('กรุณาเลือกรูปภาพไอคอน');
        return;
      }

      const payload = {
        package_name: data.packageName.trim(),
        merry_per_day:
          data.merryLimit === 'ไม่จำกัด'
            ? null
            : Number(data.merryLimit),
        details: data.details.map((d) => d.value.trim()),
        icon_url: iconUrl,
        price: parseFloat(data.price) || 0,
      };

      console.log('📦 payload to submit:', payload);
      await onSubmitProp(payload);
    } catch (error) {
      console.error('❌ Upload or save failed', error);
      setError('icon', { message: 'Upload failed. Please try again.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white mt-6 rounded-xl mx-8 p-8 space-y-8"
    >
      <div className="flex gap-6">
        <div className="w-1/2">
          <label className="block font-medium mb-1">Package name *</label>
          <input
            type="text"
            {...register('packageName', {
              required: 'Package name is required',
            })}
            className="border border-gray-300 w-full p-2 rounded"
          />
          {errors.packageName && (
            <p className="text-red-500 text-sm mt-2">
              {errors.packageName.message}
            </p>
          )}
        </div>

        <div className="w-1/2">
          <label className="block font-medium mb-1">Merry limit *</label>
          <input
            type="text"
            {...register('merryLimit', {
              required: 'Merry limit is required',
              validate: (value) => {
                if (value === 'ไม่จำกัด') return true;
                const number = parseInt(value, 10);
                return (
                  (!isNaN(number) && number >= 10) ||
                  'ต้องเป็นตัวเลข 10 ขึ้นไป หรือ "ไม่จำกัด"'
                );
              },
            })}
            className="border border-gray-300 w-full p-2 rounded"
          />
          {errors.merryLimit && (
            <p className="text-red-500 text-sm mt-2">
              {errors.merryLimit.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-1/2">
        <label className="block font-medium mb-1">Price (THB) *</label>
        <input
          type="number"
          step="1"
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'ราคาไม่สามารถติดลบได้' },
          })}
          className="border border-gray-300 w-full p-2 rounded"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-2">{errors.price.message}</p>
        )}
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
        <h2 className="text-lg font-semibold mb-2 text-gray-600">
          Package Detail *
        </h2>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <input
              className={`border p-2 flex-1 rounded ${
                errors.details?.message &&
                (!item.value || item.value.trim() === '')
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              {...register(`details.${index}.value`, {
                required: true,
              })}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
        {errors.details?.message && (
          <p className="text-red-500 text-sm mt-2">
            {errors.details.message}
          </p>
        )}
        <button
          type="button"
          onClick={() => append({ value: '' })}
          className="bg-pink-100 hover:bg-pink-200 text-[#c4003b] font-medium px-4 py-2 rounded-full cursor-pointer transition duration-200"
        >
          + Add detail
        </button>
      </div>
    </form>
  );
}
