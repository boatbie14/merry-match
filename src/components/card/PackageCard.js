import { GoCheckCircleFill } from "react-icons/go";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export const PackageCard = ({ packageName, price=0, detail=[],icon,choosePackage,styleGradient=false,StartMembership,NextBilling}) => {
    const [isExpanded, setIsExpanded] = useState(false); // สถานะเปิด/ปิด รายการที่เหลือ
    const contentRef = useRef(null); // ใช้จับ DOM ของ div รายการที่ซ่อนไว้
    const [maxHeight, setMaxHeight] = useState("0px"); // ควบคุมความสูงแบบสมูท
    
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
            <Image src={icon} alt={packageName} width={36} height={36}/>
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
                    ?<h3 className="text-center text-[#CF4FA9] text-[15px] cursor-pointer hover:underline mb-[-6px]"
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



export const PackageLongCard = ({icon,packageName,price,detail=[],status, period_end, period_start,  canceled=false,cancelPackage }) => {
    console.log(period_end)
    return (
    <div className=" mx-auto max-w-[1200px]"> 
        <div style={{background: "linear-gradient(100deg, #820025, #93345F, #A878BF)"}}
             className="flex flex-col p-4 rounded-3xl md:rounded-4xl border-[1px] border-[#D6D9E4] gap-[16px] md:p-8 md:gap-[22px]">
            <div className='md:flex md:relative '>
                <div className='md:flex gap-4 pr-8 md:pr-3 lg:w-[319px]'>
                    <div className={`w-[60px] h-[60px] md:w-[78px] md:h-[78px] border-none rounded-2xl flex items-center justify-center bg-[#F6F7FC] `}>
                        <Image src={icon} alt={packageName || 'icon'} width={48} height={48} />
                    </div>
                    <div className="flex flex-col pt-2 md:pt-0">
                        <h2 className='text-[#ffffff] text-[32px] font-bold '>{packageName}</h2>
                        <h3 className='text-[20px] text-[#F4EBF2] font-semibold md:font-normal '>THB {price} <span className='text-[#F4EBF2] text-[16px] font-normal'>/Month</span></h3>
                    </div>
                </div>
                <div className='flex flex-col text-[#F4EBF2] text-[16px] gap-4 md:gap-3 mt-4 md:mt-3 md:pr-24'>
                    {detail.map((value,index)=>(
                        <div key={index} className="flex flex-row items-center gap-4">
                            <GoCheckCircleFill  color="#DF89C6" className='md:text-[20px]'/> 
                            <h3>{packageName==="Free"?"":value}</h3>
                        </div>
                        )
                    )}
                </div>
                <div className='hidden md:flex absolute top-0 right-2 group'>
                    <button
                        className={`${status === "active" ? "text-[#B8653E] bg-[#F3E4DD]" : "text-[#5b5b5b] bg-[#aeaeae]"} font-extrabold rounded-full py-1 px-4`}
                    >
                    {status === "active" ? "Active" : "Inactive"}
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-sm rounded-lg px-3 py-1 whitespace-nowrap shadow-lg z-20">
    Your package will run out in {period_end}
  </div>
</div>
            </div>
            <hr className='text-[#E4E6ED] md:text-[#DF89C6] mt-[20px] md:mt-[28px]'/>
            <div className='md:hidden text-[16px] text-[#EFC4E2] flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <h2>Start Membership</h2>
                    <h2 className='text-[#FFFFFF]'>{period_start}</h2>
                </div>
                <div className='flex justify-between'>
                    <h2>Next billing</h2>
                    <h2 className='text-[#FFFFFF]'>{period_end}</h2>
                </div>
            </div>
            <div className='flex justify-end text-[#FFFFFF] font-bold w-full pr-2'>
                <button className={`${status==="active" && !canceled && packageName !=="Free" ?"cursor-pointer hover:underline": "hidden"}`} onClick={()=>{cancelPackage()}}>Cancel Package</button>
                {canceled && <button>Package has been cancelled.</button>}
            </div>
        </div>
    </div>
  );
};

export const CreditInfomationCard = ({icon,cardType="visa",expire="04/2025",editPaymentMethod}) => {
    return (
    <div className=" mx-auto max-w-[1200px] "> 
        <div className="flex flex-col p-4 rounded-3xl md:rounded-4xl border-[2px] border-[#D6D9E4] gap-[16px] md:p-8 md:gap-[22px] bg-white">
            <div className='md:flex md:relative '>
                <div className='md:flex gap-4 pr-8 md:pr-3 lg:w-[319px]'>
                    <button className={`w-[60px] h-[60px] md:w-[78px] md:h-[78px] border-none rounded-2xl items-center justify-center bg-[#F6F7FC] `}>
                        {icon}
                    </button>
                    <div className="flex flex-col pt-2 md:pt-0">
                        <h2 className='text-[#7D2262] text-[24px] font-bold '>{cardType}</h2>
                        <h3 className='text-[16px] text-[#646D89] font-semibold md:font-normal pt-2'>Expire {expire}</h3>
                    </div>
                </div>
            </div>
            <hr className='text-[#E4E6ED] md:text-[#D6D9E4] mt-[20px] md:mt-[28px]'/>
            <div className='md:hidden text-[16px] text-[#EFC4E2] flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <h2>Start Membership</h2>
                    <h2 className='text-[#FFFFFF]'>01/04/2022</h2>
                </div>
                <div className='flex justify-between'>
                    <h2>Next billing</h2>
                    <h2 className='text-[#FFFFFF]'>01/05/2022</h2>
                </div>
            </div>
            <div className='hidden md:flex justify-end text-[#C70039] font-bold w-full pr-2'>
                <button className='cursor-pointer hover:underline' onClick={()=>{editPaymentMethod()}}>Edit Payment Method</button>
            </div>
        </div>
    </div>
  );
};
