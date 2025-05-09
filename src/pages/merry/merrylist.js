import { AlertPopup,ProfilePopup } from "@/components/Popup";
import MarryListCard from "@/components/MarryListCard";
import { useState } from "react"; 
import { GoHeartFill } from "react-icons/go";
import DoubleHeartsIcon from "@/components/icons";
import { useEffect } from "react";
export default function MerryPage() {
   const[isMatched,setIsMatched] = useState(true)
   const[isMarray,setIsMarray] = useState(false)
   const[isProfilePopup,setIsProfilePopup] = useState(false)
   const [selectedUserId, setSelectedUserId] = useState(null)

   useEffect(()=>{console.log("ok")},[])

   const funcClickChat = () =>{

   }
   const funcClickEye = (idUser) =>{
    console.log(idUser)
    setIsProfilePopup(true)
    // ใช้ iduser หาข้อมูลที่ต้องการส่ง แล้วเปลี่ยนค่าใน selectedUserId หลังจากนั้นส่งให้ component ProfilePopup
    }   
   const funcClickHeart = () =>{ //ทำที่ client
    setIsMarray(!isMarray)
  }
  return (
    <>
    <ProfilePopup isOpen={isProfilePopup} onClose={()=>setIsProfilePopup(false)} profile={{}}/>
    <div className="row bg-[#FCFCFE] ">
      <div className="container flex flex-col  items-center mt-[80px] ">

          <div className="flex flex-col gap-2 font-bold my-10 md:mt-24 md:w-full max-w-[960px]">
            <h4 className="text-[#7B4429] font-bold">MERRY LIST</h4>
            <h1 className="text-[#A62D82] text-[32px] md:text-5xl font-extrabold">Let’s know each other with Merry! </h1>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[960px] 
                          md:flex-row md:justify-between md:items-center md:mb-10">
            
            <div className="flex flex-row gap-4 text-[#646D89] justify-center">
              <div className="border-1 border-[#F1F2F6] bg-white rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center">
                <div className="flex flex-row gap-2 items-center">
                  <h2 className="text-[#C70039] text-[24px] font-bold"> 12 </h2>
                  <GoHeartFill size={25} color="#FF1659"/>
                </div>
                <h3>Merry to you</h3>
              </div>
                
              <div className="border-1 border-[#F1F2F6] bg-white rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center">
                <div className="flex flex-row  gap-2 items-center">
                  <h2 className="text-[#C70039] text-[24px] font-bold"> 12 </h2>
                  <DoubleHeartsIcon size={25} color="#FF1659"/>
                </div>
                <h3>Merry match</h3>
              </div>
            </div>

            <div className="text-end ">
            <h2 className="text-[#646D89] text-lg">Merry limit today<span className="text-[#FF1659]">&nbsp;&nbsp;1/20</span></h2>
            <h4 className="text-[#9AA1B9] text-[12px]">Reset in <span> 12h...</span></h4>
            </div>
          </div>

          <div className="flex flex-col gap-[28px] justify-center  items-center  w-full mt-14 md:mt-0">
            <MarryListCard
              image="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzJJs4LstMWjBaZZmBAzZblKia3j7spKC_nGMi2FvVJpi2-MTpJwz_RL9THDrG"
              name="Daeny"
              age={24}
              location="Bangkok, Thailand"
              sexualIdentity="Female"
              sexualPreferences="Male"
              romanticPreferences="Indefinite"
              meetingInterests="Long-term commitment"
              isMatched={isMatched}
              isMerry={isMarray}
              matchToday={true}
              clickChat={{}}
              clickEye={(idUser)=>funcClickEye(idUser)}
              clickHeart={()=>funcClickHeart()}
              />
            <MarryListCard
              image="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzJJs4LstMWjBaZZmBAzZblKia3j7spKC_nGMi2FvVJpi2-MTpJwz_RL9THDrG"
              name="Daeny"
              age={24}
              location="Bangkok, Thailand"
              sexualIdentity="Female"
              sexualPreferences="Male"
              romanticPreferences="Indefinite"
              meetingInterests="Long-term commitment"
              isMatched={false}
              isMerry={true}
              />
            <MarryListCard
              image="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRzJJs4LstMWjBaZZmBAzZblKia3j7spKC_nGMi2FvVJpi2-MTpJwz_RL9THDrG"
              name="Daeny"
              age={32}
              location="Bangkok, Thailand"
              sexualIdentity="Female"
              sexualPreferences="Male"
              romanticPreferences="Indefinite"
              meetingInterests="Long-term commitment"
              isMatched={true}
              isMerry={false}
            />  
          </div>
      </div>
    </div>
    </>
    )
  }