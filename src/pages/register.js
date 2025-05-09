import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import TextInput from "@/components/form/TextInput";
import PasswordInput from "@/components/form/PasswordInput";
import DatePickerInput from "@/components/form/DatePickerInput";
import SelectInput from "@/components/form/SelectInput";
import MultiSelectTagInput from "@/components/form/MultiSelectTagInput";
import UploadPhotoInput from "@/components/form/UploadPhotoInput";
import { uploadImagesToSupabase } from "@/lib/uploadImagesToSupabase";
import { validateImages } from "@/utils/validateImages";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      date_of_birth: "",
      location: "",
      city: "",
      sexual_identity: "",
      sexual_preference: "",
      racial_preference: "",
      meeting_interest: "",
      hobbies: [],
      images: Array.from({ length: 5 }, (_, i) => ({
        id: `img${i + 1}`,
        src: "",
      })),
    },
  });

  const images = watch("images");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (values) => {
    setGeneralError("");

    if (values.password !== values.confirmPassword) {
      return setGeneralError("Passwords do not match");
    }

    const dob = new Date(values.date_of_birth);
    const today = new Date();
    const age =
      today.getFullYear() -
      dob.getFullYear() -
      (today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ? 1
        : 0);

    if (age < 18) {
      return setGeneralError("You must be at least 18 years old to register.");
    }

    const imageError = validateImages(values.images);
    if (imageError) {
      return setError("images", { type: "manual", message: imageError });
    }

    // 1. สมัคร user ใน auth เพื่อเอา userId มาก่อน
    const signUpRes = await fetch("/api/pre-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email, password: values.password }),
    });
    const signUpData = await signUpRes.json();

    if (!signUpRes.ok) {
      return setGeneralError(signUpData.error || "Sign up failed");
    }

    const userId = signUpData.userId;

    // 2. อัปโหลดรูปพร้อม userId
    const imageUrls = await uploadImagesToSupabase(images, userId);

    // 3. ส่งข้อมูลอื่นไป backend signup
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        ...imageUrls,
        userId,
        password: values.password, // เผื่อเอาไว้ใช้อีกครั้ง
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return setGeneralError(result.error || "Signup failed");
    }

    router.push("/register/step2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto mt-10">
      <div className="flex justify-center gap-4 mb-10">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`flex-1 text-center p-2 border-b-2 ${
              step === s ? "border-pink-500 font-bold" : "border-gray-300"
            }`}
          >
            Step {s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => <TextInput label="Name" {...field} />}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field }) => <TextInput label="Username" {...field} />}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => <TextInput label="Email" {...field} />}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <PasswordInput label="Password" {...field} />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          {password && password.length < 8 && (
            <p className="text-yellow-500 text-sm">
              Password should be at least 8 characters
            </p>
          )}

          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: "Please confirm your password" }}
            render={({ field }) => (
              <PasswordInput label="Confirm Password" {...field} />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}

          <Controller
            name="date_of_birth"
            control={control}
            rules={{ required: "Date of birth is required" }}
            render={({ field }) => (
              <div>
                <DatePickerInput label="Date of Birth" {...field} />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm">
                    {errors.date_of_birth.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <div>
                <SelectInput
                  label="Location"
                  options={[
                    { value: "thailand", label: "Thailand" },
                    { value: "usa", label: "United States" },
                    { value: "japan", label: "Japan" },
                    { value: "uk", label: "United Kingdom" },
                  ]}
                  {...field}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <div>
                <SelectInput
                  label="City"
                  options={[{ value: "bangkok", label: "Bangkok" }]}
                  {...field}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city.message}</p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="sexual_identity"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Sexual Identity"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "non-binary", label: "Non-binary" },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="sexual_preference"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Sexual Preference"
                options={[
                  { value: "men", label: "Men" },
                  { value: "women", label: "Women" },
                  { value: "everyone", label: "Everyone" },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="racial_preference"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Racial Preference"
                options={[
                  { value: "asian", label: "Asian" },
                  { value: "caucasian", label: "Caucasian" },
                  { value: "african", label: "African" },
                  { value: "mixed", label: "Mixed" },
                  { value: "other", label: "Other" },
                  { value: "no_preference", label: "No preference" },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="meeting_interest"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Meeting Interest"
                options={[
                  { value: "friendship", label: "Friendship" },
                  { value: "relationship", label: "Relationship" },
                  { value: "casual", label: "Casual" },
                  { value: "networking", label: "Networking" },
                ]}
                {...field}
              />
            )}
          />
          <Controller
            name="hobbies"
            control={control}
            render={({ field }) => (
              <MultiSelectTagInput label="Hobbies" {...field} />
            )}
          />

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <UploadPhotoInput value={field.value} onChange={field.onChange} />
            )}
          />

          {errors.images && (
            <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
          )}
          {images && images.filter((img) => img.src).length < 2 && (
            <p className="text-red-500 text-sm">
              Please upload at least 2 photos.
            </p>
          )}
          {images && !images[0]?.src && (
            <p className="text-red-500 text-sm">
              First image is required as your profile picture.
            </p>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {generalError && (
        <p className="text-red-500 text-sm mt-4">{generalError}</p>
      )}
    </form>
  );
}
