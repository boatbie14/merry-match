import { getUsers } from "@/services/userServices";
import TextInput from "@/components/form/TextInput"
import DatePickerInput from "@/components/form/DatePickerInput";
import SelectInput from "@/components/form/SelectInput";
import MultiSelectTagInput from "@/components/form/MultiSelectTagInput";
import TextArea from "@/components/form/TextArea";
import { Controller,useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import UploadPhotoInput from "@/components/form/UploadPhotoInput";

const TwoButton =()=>{
  return(
    <>
    <div className="flex flex-row justify-around gap-2 w-full">
      <button className="secondary-btn">Preview Profile</button>
      <button type="submit" className="primary-btn text-xs">Update Profile</button>
    </div>
    </>
  )
}

export default function ProfilePage() {
  const [data,setData] = useState({})
  const [loadingData,setLoadingData] = useState(false)
const { register, handleSubmit, control, watch, setError, formState: { errors }, reset } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name: '',
      username: '',
      email: '',
      date_of_birth: null,
      location: '',
      city: '',
      sexual_identity: '',
      sexual_preference: '',
      racial_preference: '',
      meeting_interest: '',
      hobbies: [],
      bio: [],  
      images: Array.from({ length: 5 }, (_, i) => ({
        id: `img${i + 1}`,
        src: "",
      })),
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true);
        const tempData = await getUsers();
        setData(tempData[0]);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        username: data.username || '',
        email: data.email || '',
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
        location: data.location || '',
        city: data.city || '',
        sexual_identity: data.sexual_identity || '',
        sexual_preference: data.sexual_preference || '',
        racial_preference: data.racial_preference || '',
        meeting_interest: data.meeting_interest || '',
        hobbies: data.hobbies || [], 
        bio:data.bio || [],
        images: data.images || Array.from({ length: 5 }, (_, i) => ({
          id: `img${i + 1}`,
          src: "",
        })),
      });
    }
  }, [data, reset]);

  const images = watch("images");

  const handleUpload =(e)=>{
    e.preventDefault()
    console.log("a")
  }
  return (
    <>
    <div className="row">
      <div className="container flex flex-col items-start md:items-center mt-[80px] ">
        <div className="max-w-[968px] w-full">
        <div className="md:flex w-full my-10 md:justify-between items-end md:my-20">
          <div className="flex flex-col gap-2 font-bold md:w-full lg:max-w-[520px] md:max-w-[420px] md:break-words ">
            <h4 className="text-[#7B4429] font-bold">PROFILE</h4>
            <h1 className="text-[#A62D82] text-[32px] lg:text-5xl md:text-4xl font-extrabold leading-[1.25]">
              Let’s make profile <br className="hidden md:inline" />to let others know you</h1>
          </div>
          <div className="hidden h-1/3 md:flex justify-end max-w-[100%] md:h-ull">
            <TwoButton/>
          </div>
        </div>

        <form className="w-full md:flex md:flex-col md:gap-20" onSubmit={(e)=>handleUpload(e)}>
          <div className=" w-full">
            <h1 className="text-[#2A2E3F] text-2xl font-extrabold ">Basic Information</h1>
            <div className="flex flex-col gap-6 mt-6 md:grid md:grid-cols-2 md:gap-10 ">
              
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => <TextInput label="Name" {...field} />}/>
              {errors.name && (<p className="text-red-500 text-sm">{errors.name.message}</p>)}

              <Controller
                name="date_of_birth"
                control={control}
                rules={{ required: "Date of birth is required" }}
                render={({ field }) => (
                <div>
                  <DatePickerInput label="Date of Birth" {...field} />
                    {errors.date_of_birth && (<p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>)}
                </div>)}
              />

              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required" }}
                render={({ field }) => (
                  <div>
                    <SelectInput label="Location"
                                 options={[
                                   { value: "Thailand", label: "Thailand" },
                                   { value: "Usa", label: "United States" },
                                   { value: "Japan", label: "Japan" },
                                   { value: "Uk", label: "United Kingdom" },]}
                                 {...field}
                    />
                    {errors.location && (<p className="text-red-500 text-sm">{errors.location.message}</p>)}
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
                      options={[{ value: "Bangkok", label: "Bangkok" }]}
                      {...field}
                    />
                    {errors.city && (<p className="text-red-500 text-sm">{errors.city.message}</p>)}
                  </div>
                )}
              />
              
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => <TextInput label="Username" {...field} />}/>
              {errors.username && (<p className="text-red-500 text-sm">{errors.username.message}</p>)}

              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field }) => <TextInput label="Email" {...field} disabled={true}  
                value="1@gmail.com"/>}
              />
            </div>
          </div>

          <div className="w-full mt-10">
            <h1 className="text-[#2A2E3F] text-2xl font-extrabold">Identities and Interests</h1>
            
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-6 
                              md:grid md:grid-cols-2 md:gap-10 mt">
                
                <Controller
                  name="sexual_identity"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      label="Sexual Identity"
                      options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "non-binary", label: "Non-binary" },]}
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
                      { value: "everyone", label: "Everyone" },]}
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
                      { value: "no_preference", label: "No preference" },]}
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
                      { value: "networking", label: "Networking" },]}
                    {...field}
                  />
                )}
              />

            </div>

            <Controller
              name="hobbies"
              control={control}
              render={({ field }) => (
                <MultiSelectTagInput label="Hobbies / Interests (Maximum 10)" {...field} />
              )}
            />

            <Controller
              name="bio"
              control={control}
              render={({field})=>(
              <TextArea label="About me (Maximum 150 characters)" rows={4} {...field} />
            )}
            />

          </div>

          </div>
          <div className=" w-full mt-10">
            <h1 className="text-[#A62D82] text-2xl font-extrabold">Profile pictures</h1>
            <h4 className="text-[#424C6B] text-[18px]">Upload at least 2 photos</h4>
            <div className="flex flex-col gap-2 mt-6 bg-amber-100 w-full">
                
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
          
                    {images && (!images[0]?.src ? (<p className="text-red-500 text-sm">First image is required as your profile picture.</p>) 
                                                : images.filter((img) => img.src).length < 2 && (<p className="text-red-500 text-sm">Please upload at least 2 photos.</p>
                                                  )
                                                )
                    }
                    
            </div>
          </div>
          <div className="md:hidden w-full my-10 ">
            <TwoButton/>
          </div>
        </form>
        <div className=" w-full flex flex-row justify-center mb-11 md:justify-end md:b-15 md:mt-20">
          <button className="text-[#646D89] text-[16px] font-bold" onClick={()=>console.log("3")}>Delete account</button>
        </div>
      </div>
      </div>
    </div>
    </>
    )
  }