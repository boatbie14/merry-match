
import {PackageCard} from "@/components/card/PackageCard";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPackage } from "@/services/packageServices";
export default function MembershipPage() {
  const router = useRouter();
  const {isLoggedIn}=useAuth()
  const [dataPackage,setDataPackage] = useState([])
  function choosePackage(title){       
    if(isLoggedIn){
        router.push(`/payment/${encodeURIComponent(title.toLowerCase())}`);       
    }else router.push('/login');
  }
  
  useEffect(()=>{
    async function fetchPackage(){
      try{
      let packageTemp = await getPackage()
      packageTemp = packageTemp.filter((item)=>item.price!==0)
                               .sort((a, b) => a.merry_per_day - b.merry_per_day);
      setDataPackage(packageTemp)
      }catch(e){
        console.log(e)
      }finally{}
    }
    fetchPackage()
  },[])
  return (

    <div className="row pt-[88px] pb-4 bg-[#FCFCFE] flex flex-col justify-center items-center"> 
        <div className="container flex flex-col items-start md:items-center mt-[80px] ">
          <div className="w-full pl-2 md:pl-6">
            <div className="md:flex w-full my-10 md:justify-between items-end md:my-20">
              <div className="flex flex-col gap-2 font-bold md:w-full md:break-words ">
                <h4 className="text-[#7B4429] font-semibold text-[14px] lg:text-[18px]">MERRY MEMBERSHIP</h4>
                <h1 className="md:hidden text-[#A62D82] text-[32px] lg:text-5xl md:text-5xl font-extrabold leading-[1.25]">
                  Join us and start <br className="hidden md:inline" />matching</h1>
                <h1 className="hidden md:block text-[#A62D82] text-[32px] lg:text-5xl md:text-4xl font-extrabold leading-[1.25]">
                  Be part of Merry Membership <br className="hidden md:inline" />to make more Merry!</h1>
                  
              </div>
            </div>
          </div>
        </div>

<div className="relative w-full max-w-screen xl:px-0 md:px-12 pb-[160px] mx-4 flex justify-center lg:max-w-[1191px]">
  <div className="w-full flex flex-col md:grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4 md:px-0 px-4 justify-items-center">
    {dataPackage.map((item) => (
      <div key={item.package_name} className="inline-block">
        <PackageCard
          icon={item.icon_url}
          packageName={item.package_name}
          price={item.price}
          detail={item.details}
          choosePackage={(package_Name) => choosePackage(package_Name)}
        />
      </div>
    ))}
  </div>
</div>


    </div>
  );
}