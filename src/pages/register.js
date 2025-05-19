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
import { validateRegisterForm } from "@/utils/validateRegisterForm";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generalError, setGeneralError] = useState("");

  const {
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

    console.log(values);

    const isValid = validateRegisterForm(values, setError);
    if (!isValid) return;

    try {
      const signUpRes = await fetch("/api/pre-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const signUpData = await signUpRes.json();

      if (!signUpRes.ok) {
        return setGeneralError(signUpData.error || "Sign up failed");
      }

      const userId = signUpData.userId;
      const imageUrls = await uploadImagesToSupabase(images, userId);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...imageUrls, userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        return setGeneralError(result.error || "Signup failed");
      }

      router.push("/login");
    } catch (err) {
      setGeneralError("Unexpected error occurred. Please try again.");
    }
  };

  const stepTitles = {
    1: "Basic Information",
    2: "Identities and Interests",
    3: "Upload Photos",
  };

  return (
    <div className="row bg-[#FCFCFE] min-h-screen pb-32 bg-deco-circle mt-14 md:mt-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-20">
        <form
          id="register-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-full  pt-16 md:pt-[85px] md:max-w-4xl lg:max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
            <div>
              <h1 className="subhead">Register</h1>
              <h2 className="main-header md:w-[453px]">Join us and start matching</h2>
            </div>
            <div className="flex items-center gap-2 md:gap-4 mb-10">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`text-center p-2 border-1 rounded-2xl ${
                    step === s
                      ? "border-[#A62D82] font-bold md:w-66 md:h-20 w-auto h-14"
                      : "border-gray-300 md:w-20 md:h-20 w-14 h-14"
                  }`}
                >
                  <div className="flex justify-center items-center gap-2 md:gap-4">
                    <div
                      className={`rounded-xl flex items-center justify-center ${
                        step === s
                          ? "bg-gray-100 p-5 md:p-6 w-6 h-6 text-[#A62D82] md:text-2xl font-bold"
                          : "bg-gray-100 p-5 md:p-6 w-6 h-6 text-[#9AA1B9] md:text-2xl font-bold"
                      }`}
                    >
                      {s}
                    </div>
                    {step === s && (
                      <div className=" text-start">
                        <div className="text-xs font-medium text-gray-400">Step {s}/3</div>
                        <div className="text-[#A62D82] font-extrabold whitespace-nowrap">
                          {stepTitles[s]}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div>
              <p className="section-title py-4 mt-10">Basic Information</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" >
                <div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput label="Name" {...field} />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DatePickerInput
                        label="Date of Birth"
                        value={field.value || null}
                        onChange={(date) => field.onChange(date)}
                        name={field.name}
                        placeholder="dd/MM/yyyy"
                      />
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.date_of_birth.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SelectInput
                        label="Location"
                        options={[
                          { value: "thailand", label: "Thailand" },
                          { value: "usa", label: "United States" },
                          { value: "japan", label: "Japan" },
                          { value: "uk", label: "United Kingdom" },
                          { value: "germany", label: "Germany" },
                          { value: "canada", label: "Canada" },
                          { value: "southkorea", label: "South Korea" },
                          { value: "australia", label: "Australia" },
                          { value: "france", label: "France" },
                          { value: "singapore", label: "Singapore" },
                          { value: "vietnam", label: "Vietnam" },
                        ]}
                        {...field}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SelectInput
                        label="City"
                        options={[
                          { value: "bangkok", label: "Bangkok" },
                          { value: "chiangmai", label: "Chiang Mai" },
                          { value: "chonburi", label: "Chonburi" },
                          { value: "khonkaen", label: "Khon Kaen" },
                          {
                            value: "nakhonratchasima",
                            label: "Nakhon Ratchasima",
                          },
                          { value: "phuket", label: "Phuket" },
                          { value: "hatyai", label: "Hat Yai" },
                          { value: "rayong", label: "Rayong" },
                          { value: "nakhonpathom", label: "Nakhon Pathom" },
                          { value: "ayutthaya", label: "Ayutthaya" },
                        ]}
                        {...field}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <div>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextInput label="Username" {...field} />
                    )}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextInput label="Email" {...field} />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput label="Password" {...field} />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.password.message}
                    </p>
                  )}
                  {password && password.length < 8 && (
                    <p className="text-yellow-500 text-sm mt-2">
                      Password should be at least 8 characters
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput label="Confirm Password" {...field} />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-red-500 text-sm mt-2">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-5 md:px-40 z-50 items-center">
                <div className=" text-gray-400">
                  <p>
                    <span className="text-gray-500 font-medium">1</span>/3
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ghost-btn"
                    disabled
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="primary-btn"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="section-title py-4 mt-10">
                Identities and Interests
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="sexual_identity"
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectInput
                          label="Sexual Identities"
                          options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "non-binary", label: "Non-binary" },
                          ]}
                          {...field}
                        />
                        {errors.sexual_identity && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.sexual_identity.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="sexual_preference"
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectInput
                          label="Sexual Preferences"
                          options={[
                            { value: "men", label: "Men" },
                            { value: "women", label: "Women" },
                            { value: "non-binary", label: "Non-binary" },
                          ]}
                          {...field}
                        />
                        {errors.sexual_preference && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.sexual_preference.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="racial_preference"
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectInput
                          label="Racial Preferences"
                          options={[
                            { value: "asian", label: "Asian" },
                            { value: "caucasian", label: "Caucasian" },
                            { value: "african", label: "African" },
                            { value: "mixed", label: "Mixed" },
                            { value: "hispanic", label: "Hispanic" },
                            { value: "no_preference", label: "No preference" },
                            { value: "other", label: "Other" },
                          ]}
                          {...field}
                        />
                        {errors.racial_preference && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.racial_preference.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="meeting_interest"
                    control={control}
                    render={({ field }) => (
                      <>
                        <SelectInput
                          label="Meeting Interests"
                          options={[
                            { value: "friendship", label: "Friendship" },
                            { value: "relationship", label: "Relationship" },
                            { value: "casual", label: "Casual" },
                            { value: "networking", label: "Networking" },
                          ]}
                          {...field}
                        />
                        {errors.meeting_interest && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.meeting_interest.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Controller
                  name="hobbies"
                  control={control}
                  render={({ field }) => (
                    <>
                      <MultiSelectTagInput
                        label="Hobbies / Interest (Maximum 10)"
                        {...field}
                      />
                      {errors.hobbies && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.hobbies.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="flex justify-between mt-6 fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-5 md:px-40 z-50 items-center">
                <div className=" text-gray-400">
                  <p>
                    <span className="text-gray-500 font-medium">2</span>/3
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ghost-btn"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="primary-btn"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="section-title py-4 mt-10">Profile pictures</p>

              <div>
                <div>
                  <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                      <UploadPhotoInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {errors.images && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.images.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6 fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-5 md:px-40 z-50 items-center">
                  <div className=" text-gray-400">
                    <p>
                      <span className="text-gray-500 font-medium">3</span>/3
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="ghost-btn"
                    >
                      Back
                    </button>
                    <button type="submit" className="primary-btn">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {generalError && (
            <p className="text-red-500 text-sm mt-4">{generalError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
