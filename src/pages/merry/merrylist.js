import { AlertPopup,ProfilePopup } from "@/components/Popup";
import MarryListCard from "@/components/MarryListCard";
import { useState } from "react"; 
import { GoHeartFill } from "react-icons/go";
import DoubleHeartsIcon from "@/components/icons";
import { useEffect } from "react";
import { postMerriyLike,deleteMerriyLike,getMarriedUsers } from "@/services/merryServices";
import useCountdown from "@/hooks/useCountdown";


// loading this page>view,card-list,Merry to you,Merry match,Merry limit today,
// Get Merry to you
// Get Merry match
// รอ Merry limit today from p.bost
//logic match yet ?
//logic and get like

//go to chat
export default function MerryPagePage() { 
  const[isMatched,setIsMatched] = useState(true)
   const[isMarray,setIsMarray] = useState(false)
   
   const [data,setData] = useState ([])
   const [loadingData,setLoadingData] = useState(false)
   
   const[isProfilePopup,setIsProfilePopup] = useState(false)
   const[DataProfilePopup,setDataProfilePopup] = useState({})

   const [merryToYouCount,setMerryToYouCount] =useState(21)
   const [matchCount,setMatchCount] =useState(8)
   const [merryLimit,setmerryLimit]=useState({limit:2,max:10})
   const [selectedUserId, setSelectedUserId] = useState(null)




const CountdownDisplay = () => {
  // console.log("CountdownDisplay re-rendered");
   const now = new Date();
   const midnight = new Date();
   midnight.setDate(now.getDate() + 1);
   midnight.setHours(0, 0, 0, 0);
   const midnightTimestamp = midnight.getTime();
   const countdown = useCountdown(midnightTimestamp);
  return <span> {countdown}</span>;
};


  useEffect(()=>{console.log("ok");
    async function fetchData(){
      try{setLoadingData(true)
        const tempData = await getMarriedUsers()
        setData(tempData)
      }catch(e){console.log(e)
      }finally{setLoadingData(false)}
    }
    fetchData()
  },[])

 
   const funcClickChat = () =>{

   }
     
   const funcClickHeart = async (idUser) =>{ //ทำที่ client
    try{
    if(isMarray){
      console.log("dededed")
      // await deleteMerriyLike(idUser)
    }
    else{
      console.log("wewew")
      // await postMerriyLike(idUser)
    }
    setIsMarray(!isMarray)
  }catch(e){
    console.log("❌🛑",e)
  }
  }

     const funcClickEye = (index) =>{ 
    console.log(data[index])
    setDataProfilePopup(data[index])
    setIsProfilePopup(true)
    }
    const closePopup = () => {
  setIsProfilePopup(false);
};
  return (
    <>
    <ProfilePopup isOpen={isProfilePopup} onClose={closePopup} items={DataProfilePopup}/>
    <div className="row bg-[#FCFCFE] ">
      <div className="container flex flex-col items-center mt-[80px] ">

          <div className="flex flex-col gap-2 font-bold my-10 md:mt-24 md:w-full max-w-[930px]">
            <h4 className="text-[#7B4429] font-bold">MERRY LIST</h4>
            <h1 className="text-[#A62D82] text-[32px] md:text-5xl font-extrabold">Let’s know each other with Merry! </h1>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[960px] 
                          md:flex-row md:justify-between md:items-center md:mb-10">
            
            <div className="flex flex-row gap-4 text-[#646D89] justify-center">
              <div className="border-1 border-[#F1F2F6] bg-white rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center">
                <div className="flex flex-row gap-2 items-center">
                  <h2 className="text-[#C70039] text-[24px] font-bold"> {merryToYouCount} </h2>
                  <GoHeartFill size={25} color="#FF1659"/>
                </div>
                <h3>Merry to you</h3>
              </div>
                
              <div className="border-1 border-[#F1F2F6] bg-white rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center">
                <div className="flex flex-row  gap-2 items-center">
                  <h2 className="text-[#C70039] text-[24px] font-bold"> {matchCount} </h2>
                  <DoubleHeartsIcon size={25} color="#FF1659"/>
                </div>
                <h3>Merry match</h3>
              </div>
            </div>

            <div className="text-end ">
            <h2 className="text-[#646D89] text-lg">Merry limit today<span className="text-[#FF1659]">&nbsp;&nbsp;{merryLimit.limit}/{merryLimit.max}</span></h2>
            <h4 className="text-[#9AA1B9] text-[12px]">Reset in <span> {<CountdownDisplay/>}</span></h4>
            </div>
          </div>

            {loadingData?(<h1>LoadingData</h1>):data.map((obj,index)=>(
              <div className="flex flex-col gap-[28px] justify-center  items-center w-full mt-14 md:mt-0" key={obj.id}>
                <MarryListCard items={obj}
                               clickChat={{}}
                               clickEye={()=>funcClickEye(index)}
                               clickHeart={(idUser)=>funcClickHeart(idUser)}/>
              </div>))
            }
      </div>
    </div>
    </>
    )
  }