import { GoCheckCircleFill } from "react-icons/go";
import Image from "next/image";
import { HiCreditCard } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@mui/material";


export const PackageCard = ({ packageName, price=0, detail=[],icon,choosePackage,styleGradient=false,StartMembership,NextBilling}) => {
    const [isExpanded, setIsExpanded] = useState(false); 
    const contentRef = useRef(null); 
    const [maxHeight, setMaxHeight] = useState("0px");
    
    if(detail.length<2){detail.push("")}
    const visibleDetails = detail.slice(0, 2);
    const hiddenDetails = detail.slice(2);

    useEffect(() => {
        if (isExpanded) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight("0px");
        }
    }, [isExpanded]);
    return (
    <div 
    className="flex flex-col  p-4 bg-[#ffffff] rounded-3xl border-[1px] border-[#D6D9E4] gap-[12px] md:p-10 md:gap-[20px] md:w-[357px] w-full  md:min-h-[441px] mb-6 md:shadow-[0_4px_8px_-2px_rgba(0,0,0,0.1)]">
        <button className={`w-[60px] h-[60px] border-none rounded-2xl inline-flex items-center justify-center bg-[#F6F7FC]`}>
            <Image src={icon} alt={packageName} width={30} height={30}/>
        </button>
        <div className="flex flex-col">
            <h2 className={`text-[#411032] text-[32px] font-bold md:text-[36px]`}>{packageName.charAt(0).toUpperCase() + packageName.slice(1)}</h2>
            <h3 className={`text-[20px] text-[#2A2E3F] font-semibold `}>THB {Number(price).toFixed(2)} <span className={`text-[#9AA1B9] text-[16px] font-normal`}>/Month</span></h3>
        </div>
        <div className={`flex flex-col text-[#424C6B] mb-[10px] md:pb-[3px] text-[16px] `}>
            {visibleDetails.map((value,index)=>(
                <div key={index} className="flex flex-row items-center gap-3 md:gap-4 pb-2 md:pb-4 tracking-tight">
                    {value===""?<div className="mt-6"></div>: <GoCheckCircleFill  color={"#CF4FA9"}/>} 
                    <h3>{value}</h3>
                </div>
            )
            )
            }
            <div
                ref={contentRef}
                style={{
                maxHeight: isExpanded ? maxHeight : "0px",       
                overflow: "hidden",                              
                transition: "max-height 0.5s ease",              
                }}
            >
                <div className={`flex flex-col text-[#424C6B] mb-[10px] md:pb-[3px] text-[16px] gap-2 md:gap-4`}>
                    {hiddenDetails.map((value, index) => (
                        <div key={index} className="flex flex-row items-center gap-2 md:gap-4">
                            <GoCheckCircleFill color={styleGradient ? "#DF89C6" : "#CF4FA9"} />
                            <h3>{value}</h3>
                        </div>
                    ))}
                </div>
            </div>
        
            <div>
                {detail.length>2
                    ?<h3 className="text-center text-[#CF4FA9] text-[15px] cursor-pointer hover:underline mb-[-5.5px]"
                        onClick={() => setIsExpanded(!isExpanded)} > {isExpanded ? "Show Less" : "Show More"}
                    </h3>
                    :<div className="pt-[16px] "></div> }
                    <hr className='text-[#E4E6ED] mb-[-4px]'/>
            </div>
        </div>
        <button className='secondary-btn' onClick={()=>choosePackage(packageName)}>Choose Package</button>
    </div>
)
};



export const PackageLongCard = ({icon,packageName,price,detail=[],status, period_end, period_start,canceled=false,cancelPackage }) => {
    console.log(detail)
    return (
    <div className=" mx-auto max-w-[1200px]"> 
        <div style={{background: "linear-gradient(100deg, #820025, #93345F, #A878BF)"}}
             className="flex flex-col p-4 rounded-3xl md:rounded-4xl border-[1px] border-[#D6D9E4] gap-[16px] md:p-8 md:gap-[22px]">
            <div className='md:flex md:relative '>
                <div className='md:flex gap-4 pr-8 md:pr-3 lg:w-[319px]'>
                    <div className={`w-[60px] h-[60px] md:w-[78px] md:h-[78px] border-none rounded-2xl flex items-center justify-center bg-[#F6F7FC] `}>
                        {icon? <Image src={icon} alt={packageName || 'icon'} width={32.5} height={32.5} />:<Skeleton variant="circular" height={48} width={48}/>}
                    </div>:
                    <div className="flex flex-col pt-2 md:pt-0">
                        {packageName?<h2 className='text-[#ffffff] text-[32px] font-bold '>{packageName.charAt(0).toUpperCase() + packageName?.slice(1)}</h2>:<Skeleton width={170} height={50}/>}
                        {packageName?<h3 className='text-[20px] text-[#F4EBF2] font-semibold md:font-normal '>THB {price.toFixed(2)} <span className='text-[#F4EBF2] text-[16px] font-normal'>/Month</span></h3>:<Skeleton width={100} height={30}/>}
                    </div>
                </div>
                <div className='flex flex-col text-[#F4EBF2] text-[16px] gap-4 md:gap-3 mt-4 md:mt-3 md:pr-24'>
                    {detail.map((value,index)=>(
                        <div key={index} className="flex flex-row items-center gap-4">
                            <GoCheckCircleFill  color="#DF89C6" className='md:text-[20px]'/> 
                            <h3>{value}</h3>
                        </div>
                        )
                    )}
                </div>
                    {packageName!=="Free" && 
                        <div className='hidden md:flex absolute top-0 right-2 group'>
                            <button
                                className={`${status === "active" ? "text-[#B8653E] bg-[#F3E4DD]" : "text-[#5b5b5b] bg-[#aeaeae]"} font-extrabold rounded-full py-1 px-4`}
                            >
                                {status === "active" ? "Active" : ""}
                            </button>
                            {status === "active" &&
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm rounded-lg px-3 py-1 whitespace-nowrap shadow-lg z-20">
                                {canceled?"Subscription ends on":"Next billing"} {period_end}
                            </div>}
                        </div>
                    }
            </div>
            <hr className='text-[#E4E6ED] md:text-[#DF89C6] mt-[20px] md:mt-[28px]'/>
            {packageName !== "Free" &&
                <div className='md:hidden text-[16px] text-[#EFC4E2] flex flex-col gap-2'>            
                    <div className='flex justify-between'>
                        <h2>Start Membership</h2>
                        <h2 className='text-[#FFFFFF]'>{period_start}</h2>
                    </div>
                    <div className='flex justify-between'>
                        <h2>{canceled?"Subscription ends on":"Next billing"}</h2>
                        <h2 className='text-[#FFFFFF]'>{period_end}</h2>
                    </div>
                </div>
            }
            <div className='flex justify-end text-[#FFFFFF] font-bold w-full pr-2'>
                {packageName?
                <button className={`${status==="active" && !canceled && packageName !=="Free" ?"cursor-pointer hover:underline": "hidden"}`} onClick={()=>{cancelPackage()}}>Cancel Package</button>
                :""}
                {canceled && <button>Package has been cancelled.</button>}
                
                </div>
        </div>
    </div>
  );
};

export const CreditInfomationCard = ({cardType,expire,last4,editPaymentMethod,canceled=false}) => {
    return (
    <div className=" mx-auto max-w-[1200px]"> 
        <div className="flex flex-col p-4 rounded-3xl md:rounded-4xl border-[1px] border-[#D6D9E4] gap-[16px] md:p-8 md:pb-6 bg-white ">
            <div className='flex md:flex gap-4 md:pr-3 '>
                    <div className={`w-[64px] h-[64px] md:w-[68px] md:h-[68px] border-none flex rounded-2xl items-center justify-center bg-[#F6F7FC]`}>
                        <HiCreditCard size={32} color="#FFB1C8"/>
                    </div>
                    <div className="flex flex-col md:pt-0">
                        {last4?<h2 style={{ letterSpacing: "-0.02em" }} className='text-[#7D2262] text-[24px] font-bold'>{cardType} ending *{last4}</h2>:<Skeleton width={300} height={40}/>}
                        {last4?<h3 className='text-[16px] text-[#646D89] font-semibold md:font-normal pt-1'>Expire {expire}</h3>:<Skeleton width={200} height={20}/>}
                    </div>
            </div>
            <hr className='text-[#D6D9E4] mt-2 md:mt-[6px]'/>
            <div className=' md:flex justify-end text-[#C70039] font-bold w-full pr-2 md:mt-1 text-end'>
                {last4 && !canceled ? <button className='cursor-pointer hover:underline md:mt-1' onClick={()=>{editPaymentMethod()}}>Edit Payment Method</button>:<div className="h-7"></div>}
            </div>
        </div>
    </div>
  );
};
