
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
  const dummy = [{
    packageName:"Basic",
    price:"59.00",
    detail:["‘Merry’ more than a daily limited","Up to 25 Merry per day"],
    icon:"URL + style"
  },{
    packageName:"Platinum",
    price:"59.00",
    detail:["‘Merry’ more than a daily limited","Up to 45 Merry per day"],
    icon:"https://www.pngwing.com/en/free-png-zmzwc"
  },{
    packageName:"Premium",
    price:"149.00",
    detail:["‘Merry’ more than a daily limited","Up to 70 Merry per day"],
    icon:"ดูก่อนเก็บภาพยังไง"
  },
]

  return (

    <div className="row pt-[88px] pb-4 bg-[#FCFCFE] "> 
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

        <div className="min-h-scree flex justify-center items-center flex-wrap mb-[160px] md:gap-10 gap-6 px-5 pt-4">
          {dataPackage.map((item)=>(
            <PackageCard 
            key={item.package_name}
            icon={item.icon_url}
            packageName={item.package_name}
            price={item.price}
            detail={item.details}
            choosePackage={(package_Name)=>{choosePackage(package_Name)}}
          />)
          )}
        </div>
    </div>
  );
}