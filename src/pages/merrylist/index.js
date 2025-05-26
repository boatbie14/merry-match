  import { ProfilePopup } from "@/components/popup/ProfilePopup";
  import MarryListCard from "@/components/MerryList/MarryListCard";
  import { useState } from "react"; 
  import { GoHeartFill } from "react-icons/go";
  import DoubleHeartsIcon from "@/components/icons";
  import { useEffect } from "react";
  import { getMarriedUsers,getMerriedMe,getMerriedMatch} from "@/services/merryServices";
  import useCountdown from "@/hooks/useCountdown";
  import { CircularProgress } from "@mui/material";
  import SkeletonMerryListCard from "@/components/MerryList/SkeletonMerryListCard";
  import { useAuth } from "@/context/AuthContext";
  import { useRouter } from "next/router";

  import { useMerryLimit } from "@/context/MerryLimitContext";

  // TODO 🕐goto chat page
  export default function MerrylistPage() {
    const {checkingLogin,isLoggedIn}=useAuth()
    const {merryLimit} = useMerryLimit()
    const router =useRouter()
     const [data,setData] = useState ([])
     const [merriedMe,setMerriedMe] = useState(0)
     const [merriedMatch,setMerriedMatch] = useState(0)  
     
     const [selectedBox, setSelectedBox] = useState(0);
     
     const [loadingData,setLoadingData] = useState(false)
     const [loadingMerriedMe,setLoadingMerriedMe] = useState(false)
     const [loadingMerriedMatch,setLoadingMerriedMatch] = useState(false)  
  
     const[isProfilePopup,setIsProfilePopup] = useState(false)
     const[DataProfilePopup,setDataProfilePopup] = useState({})
  
  
     
  
  useEffect(() => {
      if (!checkingLogin && !isLoggedIn) {
        router.push('/');
      }
    }, [checkingLogin, isLoggedIn, router]);
  
    useEffect(() => {
      if (checkingLogin || !isLoggedIn) return;
  
      const fetchAllData = async () => {
        try {
          setLoadingData(true);
          setLoadingMerriedMe(true);
          setLoadingMerriedMatch(true);
  
          const [users, me, match] = await Promise.all([
            getMarriedUsers(),
            getMerriedMe(),
            getMerriedMatch(),
          ]);
  
          setData(users);
          setMerriedMe(me);
          setMerriedMatch(match);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingData(false);
          setLoadingMerriedMe(false);
          setLoadingMerriedMatch(false);
        }
      };
  
      fetchAllData();
    }, [checkingLogin, isLoggedIn]);
  
   const CountdownDisplay = () => {
     const now = new Date();
      const midnightUTC = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));
    const midnightTimestamp = midnightUTC.getTime();
     const countdown = useCountdown(midnightTimestamp);
    return <span> {countdown}</span>;
  };
  const handleClickTopBox = (boxId) => {
      setSelectedBox((prev) => (prev === boxId ? 0 : boxId));
      
    };
  
  
  const handleClickChat = () =>{
  
     }
     
    const handleClickEye = (index) =>{ 
      setDataProfilePopup(data[index])
      setIsProfilePopup(true)
      }
  
  let filterData = data
   if(selectedBox===1){
    filterData = merriedMe
   }else if(selectedBox ===2){
     filterData = data.filter((obj) => {return merriedMatch?.allMatches.includes(obj?.id)})
                       .sort((a, b) =>merriedMatch.allMatches.indexOf(a.id)-merriedMatch.allMatches.indexOf(b.id)
    );
    }      
  
    return (
      <>
  
      <ProfilePopup isOpen={isProfilePopup} 
                    onClose={()=>setIsProfilePopup(false)} 
                    items={DataProfilePopup} 
                    />
      <div className="row bg-[#FCFCFE] pt-[88px] ">
        <div className="container flex flex-col items-center mt-[80px] ">
            <div className="flex flex-col gap-2 font-bold my-10 md:mt-24 md:w-full max-w-[930px]">
              <h4 className="text-[#7B4429] font-bold">MERRY LIST</h4>
              <h1 className="text-[#A62D82] text-[32px] md:text-5xl font-extrabold">Let’s know each other with Merry! </h1>
            </div>
  
            <div className="flex flex-col gap-4 w-full max-w-[960px] 
                            md:flex-row md:justify-between md:items-center md:mb-10">
              
              <div className="flex flex-row gap-5 mx-1  text-[#646D89] justify-center">
                <div className={`hover:scale-110 transition-transform duration-300  border-1 hover:border-[#d9dadd] border-[#F1F2F6] rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center ${
                                selectedBox === 1
                                ? "scale-110 bg-pink-100 "
                                : "bg-white"} `}
                     onClick={() => handleClickTopBox(1)}>
                  <div className="flex flex-row gap-2 items-center">
                    {loadingMerriedMe?<CircularProgress color="secondary" size="30px" />:<h2 className="text-[#C70039] text-[24px] font-bold"> {merriedMe?.length} </h2>}
                    <GoHeartFill size={25} color="#FF1659"/>
                  </div>
                  <h3>Merry to you</h3>
                </div>
                  
                <div className={`hover:scale-110 transition-transform duration-300  border-1 hover:border-[#d9dadd] border-[#F1F2F6] rounded-xl w-full md:w-[200px] h-[98px] px-[20px] py-[24px] flex flex-col justify-center ${
                                selectedBox === 2
                                ? "scale-110 bg-pink-100 "
                                : "bg-white"} `}
                     onClick={() => handleClickTopBox(2)}>
                  <div className="flex flex-row  gap-2 items-center">
                    <h2 className="text-[#C70039] text-[24px] font-bold"> 
                      {loadingMerriedMatch? <CircularProgress color="secondary" size="30px" />:merriedMatch?.allMatches?.length} 
                      </h2>
                    <DoubleHeartsIcon size={25} color="#FF1659"/>
                  </div>
                  <h3>Merry match</h3>
                </div>
              </div>
  
              <div className="text-end ">
              <h2 className="text-[#646D89] text-lg">Merry limit today<span className="text-[#FF1659]">&nbsp;&nbsp;{merryLimit.count}/{merryLimit.merry_per_day}</span></h2>
              <h4 className="text-[#9AA1B9] text-[12px]">Reset in <span> {<CountdownDisplay/>}</span></h4>
              </div>
            </div>
  
              {loadingData? 
                  (<div className="flex flex-col gap-[28px] justify-center  items-center w-full mt-14 md:mt-0">
                    {Array.from({ length: 3 }).map((_,i)=><SkeletonMerryListCard key={i}/>)}
                  </div>)
                  :
                  filterData
                      .map((obj, index) => {
                        return(
                          <div className="flex flex-col gap-[28px] justify-center  items-center w-full mt-14 md:mt-0" key={obj.id}>
                            <MarryListCard items={obj}
                                       clickChat={{}}
                                       clickEye={(isMerry,setIsMerry)=>handleClickEye(index,isMerry,setIsMerry)}
                                       isMatched={merriedMatch?.allMatches?.includes(obj.id)}
                                       matchToday={merriedMatch?.todayMatches?.includes(obj.id)}
                            />
                          </div>)})
                      }
        </div>
      </div>
      </>
      )
    }