  import TextInput from "@/components/form/TextInput"
  import DatePickerInput from "@/components/form/DatePickerInput";
  import SelectInput from "@/components/form/SelectInput";
  import MultiSelectTagInput from "@/components/form/MultiSelectTagInput";
  import TextArea from "@/components/form/TextArea";
  import { Controller,useForm } from "react-hook-form";
  import { useEffect, useState } from "react";
  import UploadPhotoInput from "@/components/form/UploadPhotoInput";
  import { uploadImagesToSupabase } from "@/lib/uploadImagesToSupabase";
  import { deleteUsers,updateUserProfile } from "@/services/profileServices";
  import { useAuth } from "@/context/AuthContext";
  import { useRouter } from "next/router";
  import { getUserHobbies } from "@/services/hobbiesServices";
  import { mergeAndSortImageUrls } from "@/utils/image-handlers/mergeImageUrls";
  import { ProfilePopup } from "@/components/popup/ProfilePopup";
  import { AlertPopup } from "@/components/popup/AlertPopup";
  import { LoadingPop } from "@/components/popup/LoadingPop";
  import { prepareDeleteImages } from "@/utils/image-handlers/prepareDeleteImages";
import { Alert, Snackbar } from '@mui/material';
import { validateUpdateForm } from "@/utils/validateUpdateProfileForm";
import { Country, State } from "country-state-city";

  export default function ProfilePage() {
    const {userInfo,isLoggedIn,checkingLogin}=useAuth()
    const router = useRouter()
    const [data,setData] = useState()
    const [loading,setLoading] = useState(true)
    const [isAlertPopup,setIsAlertPopup] = useState(false)
    const [alertPopupInfo,setIsAlertPopupInfo] = useState ({ 
        title: "",
        description: "",
        buttonLeftText: "",
        buttonRightText: "",
        buttonLeftClick: () => {},
        buttonRightClick: () => {},
    })
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const[isProfilePopup,setIsProfilePopup] = useState(false)
    const[DataProfilePopup,setDataProfilePopup] = useState({})
    
    
      useEffect(() => {
        if (!checkingLogin && !isLoggedIn) {
          router.push('/login'); }
      }, [checkingLogin, isLoggedIn, router]); 

      useEffect(()=>{
        const fetchHobbies = async()=>{
        const hobbiestemp = await getUserHobbies(userInfo.id)
        const hobbies= Object.values(hobbiestemp).map(item => item.hobbie_name);
        setData({...userInfo,hobbies:hobbies})
        }

        if(userInfo){
        fetchHobbies() 
      }
      },[userInfo])

  const { handleSubmit, control, watch, setError, formState: { errors }, reset } = useForm({
      shouldUnregister: false,
      defaultValues: {
        id:'',
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
          file: null,
        })),
      },
    });

    useEffect(() => {
      if (data) {
        reset({
          id:data.id || '',
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
          images: [{ id: "img1", src: data.profile_image_url || "", file: null },
                  { id: "img2", src: data.image2_url || "", file: null },
                  { id: "img3", src: data.image3_url || "", file: null },
                  { id: "img4", src: data.image4_url || "", file: null },
                  { id: "img5", src: data.image5_url || "", file: null },],
        });
      setLoading(false);
      }
    }, [data,reset]);
    const images = watch("images");
    const selectedCountry = watch("location") || data?.location || '';
    const countries = Country.getAllCountries();
    const states = selectedCountry
      ? State.getStatesOfCountry(selectedCountry)
      : [];
    const countryOptions = countries.map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));

    const cityOptions = states.map((s) => ({
      label: s.name,
      value: s.name,
    }));


  const onSubmit = async (values) => {
  try {
    setLoading(true);

    const isValid = validateUpdateForm(values, setError);
    if (!isValid){
    onError(errors)
    setLoading(false);
      return };

    const prepareUploadImages = values.images.map((imageItem) =>
      imageItem.file ? imageItem : { ...imageItem, file: null }
    );
    const imageUrlUpload = await uploadImagesToSupabase(prepareUploadImages, data.id);
    const finalImageUrls = mergeAndSortImageUrls(imageUrlUpload, values.images);
    const filesToDelete = prepareDeleteImages(values.images,data)

    const { images, ...valuesWithoutImages } = values;
    const response = await updateUserProfile({
      profileData: { ...valuesWithoutImages, ...finalImageUrls },
      deletedImages :filesToDelete
    });
    

    if (response) {
      setAlertMessage("Profile update successful!");
      setAlertSeverity("success");
      window.location.reload();
      // router.replace(router.asPath);
    } else {
      setAlertMessage("Profile update failed");
      setAlertSeverity("error");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    setAlertMessage("An error occurred while updating the profile.");
    setAlertSeverity("error");
  } finally {
    setLoading(false);
  }
};

  const onError = (errors) => {
  setAlertSeverity("error");
  const firstField = Object.keys(errors)[0]; // หาชื่อ field แรกที่ error
  if (firstField) {
    const firstError = errors[firstField];
    const message = firstError?.message || "Unexpected error occurred. Please try again.";
    setAlertMessage(message);
  }else setAlertMessage("Incorrect information. Please check the information")
  return;
}



  const handleDeleteUser = async() =>{
    try{
    setIsAlertPopup(false)
    setLoading(true)
    const response = await deleteUsers()
        console.log("delete")
    if (response.status === 204){
            setIsAlertPopup(false)
            router.push('/logout'); 
            setLoading(false)
    }
    }catch(e){console.log(e)
      setAlertMessage("Failed to delete user");
      setAlertSeverity("error");
    }finally{setLoading(false)}
  }

const TwoButton =()=>{
    return(
      <>
      <div className="flex flex-row justify-around gap-2 w-full">
        <button type="button" className="secondary-btn" onClick={()=>setIsProfilePopup(true)}>Preview Profile</button>
        <button type="submit" className="primary-btn text-xs">Update Profile</button>
      </div>
      </>
    )
  }

    return (
      <>
      <LoadingPop isLoading={loading}/>
      <AlertPopup
        isOpen={isAlertPopup}
        onClose={()=>setIsAlertPopup(false)}
        title={alertPopupInfo.title}
        description={alertPopupInfo.description}
        buttonLeftText={alertPopupInfo.buttonLeftText}
        buttonRightText={alertPopupInfo.buttonRightText}
        buttonLeftClick={alertPopupInfo.buttonLeftClick}
        buttonRightClick={alertPopupInfo.buttonRightClick}
      />
      <ProfilePopup 
        isOpen={isProfilePopup} 
        onClose={()=>setIsProfilePopup(false)} 
        items={userInfo||{}} 
    />
      
      <div className="row pt-[88px]"> 
        <div className="container flex flex-col items-start md:items-center mt-[80px] ">
          <div className="max-w-[968px] w-full">
            <form onSubmit={handleSubmit(onSubmit,onError)}>
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
        
          <div className="w-full md:flex md:flex-col md:gap-20 " >
            <div className=" w-full">
              <h1 className="text-[#2A2E3F] text-2xl font-extrabold ">Basic Information</h1>
              <div className="flex flex-col gap-6 mt-6 md:grid md:grid-cols-2 md:gap-10">
                
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                  <div>
                    <TextInput label="Name" {...field} />
                    {errors.name && (<p className="text-red-500 text-sm">{errors.name.message}</p>)}
                  </div>)}/>

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
                        options={countryOptions}
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
                          options={cityOptions}
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
                  render={({ field }) => (
                  <div>
                    <TextInput label="Username" {...field} />
                    {errors.username && (<p className="text-red-500 text-sm">{errors.username.message}</p>)}
                  </div>)}
                />
                

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => <TextInput label="Email" {...field} disabled={true} />}
                />
              </div>
            </div>

            <div className="w-full mt-10">
              <h1 className="text-[#2A2E3F] text-2xl font-extrabold">Identities and Interests</h1>
              
              <div className="flex flex-col gap-6 mt-6 md:gap-10">
                <div className="flex flex-col gap-6 
                                md:grid md:grid-cols-2 md:gap-10">
                  
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
                      {...field}
                    />
                  )}
                />

              </div>
              <div>
                <Controller
                  name="hobbies"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectTagInput label="Hobbies / Interests (Maximum 10)" {...field} />
                  )}
                />
                      {errors.hobbies && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.hobbies.message}
                        </p>
                      )}
                </div>
                <div>
                  <Controller
                    name="bio"
                    control={control}
                    render={({field})=>(
                    <TextArea label="About me (Maximum 150 characters)" rows={4} {...field}  textareaProps={{ maxLength: 150 }} />
                )}
                />
                </div>
            </div>

            </div>
            <div className=" w-full mt-10">
              <h1 className="text-[#A62D82] text-2xl font-extrabold">Profile pictures</h1>
              {/* <h4 className="text-[#424C6B] text-[18px]">Upload at least 2 photos</h4> */}
              <div className="flex flex-col gap-2 mt-6  w-full">
                  
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
            
                      {images && (!images[0]?.src && (<p className="text-red-500 text-sm">First image is required as your profile picture.</p>) )}
                      
              </div>
            </div>
            <div className="md:hidden w-full my-10 ">
              <TwoButton/>
            </div>
            </div>
          </form>
          <div className=" w-full flex flex-row justify-center mb-11 md:justify-end md:b-15 md:mt-20">
            <button className="text-[#646D89] text-[16px] font-bold cursor-pointer" onClick={()=>{
              setIsAlertPopupInfo({
                                title: "Delete Confirmation",
                                description: "Do you sure to delete account?",
                                buttonLeftText: "Yes, I want to delete",
                                buttonRightText: "No, I don’t",
                                buttonLeftClick: () => {handleDeleteUser()},
                                buttonRightClick: () => {setIsAlertPopup(false);}})
               setIsAlertPopup(true);}
              }>Delete account</button>
          </div>
        </div>
        </div>
      </div>
      
      <Snackbar className="mt-[100px]"
        open={!!alertMessage}
        autoHideDuration={4000}
        onClose={() => setAlertMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertMessage("")}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      </>
      )
    }