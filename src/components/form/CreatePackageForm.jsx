import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CreatePackageForm({
  initialData = {},
  isEditMode = false,
  onSubmit,
  isSubmitting = false,
  setExternalSubmit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      package_name: "",
      merry_per_day: "",
      price: "",
      details: "",
    },
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        package_name: initialData.package_name || "",
        merry_per_day:
          initialData.merry_per_day === null
            ? ""
            : initialData.merry_per_day.toString(),
        price:
          initialData.price === null
            ? ""
            : initialData.price.toString(),
        details: Array.isArray(initialData.details)
          ? initialData.details.join("\n")
          : initialData.details || "",
      });
    }
  }, [initialData, reset]);

    useEffect(() => {
    if (setExternalSubmit) {
      setExternalSubmit(() => handleSubmit(handleFormSubmit));
    }
  }, [setExternalSubmit, handleSubmit]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        package_name: data.package_name.trim(),
        merry_per_day:
          data.merry_per_day === "" || data.merry_per_day === null
            ? null
            : Number(data.merry_per_day),
        price:
          data.price === "" || data.price === null
            ? null
            : Number(data.price),
        details: data.details
          ? data.details
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [],
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        alert("❌ ยังไม่ได้ใส่ onSubmit handler");
      }
    } catch (err) {
      console.error("❌ Failed to submit:", err.message);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 p-6 max-w-xl"
    >
      <div>
        <label className="block font-medium mb-1">ชื่อแพ็กเกจ *</label>
        <input
          {...register("package_name", { required: "กรุณากรอกชื่อแพ็กเกจ" })}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        {errors.package_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.package_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">
          จำนวนแมตช์/วัน (Merry/วัน) *
        </label>
        <input
          type="number"
          {...register("merry_per_day", {
            validate: (value) => {
              if (value === "" || value === null) return true;
              if (isNaN(value)) return "กรุณาใส่ตัวเลขเท่านั้น";
              if (Number(value) < 1) return "ต้องมากกว่า 0";
              return true;
            },
          })}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        {errors.merry_per_day && (
          <p className="text-red-500 text-sm mt-1">
            {errors.merry_per_day.message}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">ปล่อยว่าง = ไม่จำกัด</p>
      </div>

      <div>
        <label className="block font-medium mb-1">ราคาแพ็กเกจ (บาท) *</label>
        <input
          type="number"
          {...register("price", {
            required: "กรุณากรอกราคา",
            validate: (value) => {
              if (isNaN(value)) return "กรุณาใส่ตัวเลขเท่านั้น";
              if (Number(value) < 0) return "ราคาต้องมากกว่าหรือเท่ากับ 0";
              return true;
            },
          })}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">รายละเอียดแพ็กเกจ</label>
        <textarea
          {...register("details")}
          rows={4}
          placeholder="พิมพ์แต่ละรายการลงคนละบรรทัด"
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#c4003b] hover:bg-[#a8002f]"
        } text-white px-6 py-2 rounded-full transition duration-200`}
      >
        {isEditMode ? "บันทึกการแก้ไข" : "สร้างแพ็กเกจ"}
      </button>
    </form>
  );
}
