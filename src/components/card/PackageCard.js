import { GoCheckCircleFill } from "react-icons/go";
import Image from "next/image";
export const PackageCard = ({ packageName, price, detail=[],icon,choosePackage,styleGradient=false,StartMembership,NextBilling }) => {
const gradientStyle = styleGradient?{ background: "linear-gradient(100deg, #820025, #93345F, #A878BF)" }:{};
    return (
    <div 
    style={gradientStyle}
    className="flex flex-col p-4 bg-[#ffffff] rounded-3xl border-[1px] border-[#D6D9E4] w-243 gap-[16px] md:p-10 md:gap-[22px] md:w-[357px]">
        <button className={`w-[60px] h-[60px] border-none rounded-2xl inline-flex items-center justify-center bg-[#F6F7FC]`}>
            {/* <Image src={icon} /> */}
            {icon}
        </button>
        <div className="flex flex-col">
            <h2 className={`${styleGradient?"text-[#ffffff]":"text-[#411032]"} text-[32px] font-bold md:text-[36px]`}>{packageName}</h2>
            <h3 className={`text-[20px] ${styleGradient?"text-[#F4EBF2]":"text-[#2A2E3F]"} font-semibold `}>THB {price} <span className={`${styleGradient?"text-[#F4EBF2]":"text-[#9AA1B9]"} text-[16px] font-normal`}>/Month</span></h3>
        </div>
        <div className={`flex flex-col ${styleGradient?"text-[#F4EBF2]":"text-[#424C6B]"} text-[16px] gap-2 md:gap-4`}>
            {detail.map((value,index)=>(
                <div key={index} className="flex flex-row items-center gap-4">
                    <GoCheckCircleFill  color={styleGradient?"#DF89C6":"#CF4FA9"}/> 
                    <h3>{value}</h3>
                </div>
            )
            )}
        </div>
        <hr className='text-[#E4E6ED] mt-[10px] md:pt-[3px]'/>

        {StartMembership && NextBilling 
            ?<div className='text-[16px] text-[#EFC4E2] flex flex-col gap-2'>
                <div className='flex justify-between'>
                    <h2>Start Membership</h2>
                    <h2 className='text-[#FFFFFF]'>01/04/2022</h2>
                </div>
                <div className='flex justify-between'>
                    <h2>Next billing</h2>
                    <h2 className='text-[#FFFFFF]'>01/05/2022</h2>
                </div>
            </div>
            :<button className='secondary-btn' onClick={()=>choosePackage(packageName)}>Choose Package</button>}
    </div>
)
};



export const PackageLongCard = ({icon,packageName,price,detail=["‘Merry’ more than a daily limited "],status,cancelPackage}) => {
    return (
    <div className=" mx-auto max-w-[1200px]"> 
        <div style={{background: "linear-gradient(100deg, #820025, #93345F, #A878BF)"}}
             className="flex flex-col p-4 rounded-3xl md:rounded-4xl border-[1px] border-[#D6D9E4] gap-[16px] md:p-8 md:gap-[22px]">
            <div className='md:flex md:relative '>
                <div className='md:flex gap-4 pr-8 md:pr-3 lg:w-[319px]'>
                    <button className={`w-[60px] h-[60px] md:w-[78px] md:h-[78px] border-none rounded-2xl items-center justify-center bg-[#F6F7FC] `}>
                        {icon}
                    </button>
                    <div className="flex flex-col pt-2 md:pt-0">
                        <h2 className='text-[#ffffff] text-[32px] font-bold '>{packageName}</h2>
                        <h3 className='text-[20px] text-[#F4EBF2] font-semibold md:font-normal '>THB {price} <span className='text-[#F4EBF2] text-[16px] font-normal'>/Month</span></h3>
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
                <div className='hidden md:flex absolute top-0 right-2'>
                    <button className={`${status==="Active"?"text-[#B8653E] bg-[#F3E4DD]":"text-[#5b5b5b] bg-[#aeaeae]"} font-extrabold rounded-full  py-1 px-4`}>{status==="Active"?"Active":"Inactive"}</button>
                </div>
            </div>
            <hr className='text-[#E4E6ED] md:text-[#DF89C6] mt-[20px] md:mt-[28px]'/>
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
            <div className='hidden md:flex justify-end text-[#FFFFFF] font-bold w-full pr-2 '>
                <button className='cursor-pointer hover:underline' onClick={()=>{cancelPackage()}}>Cancel Package</button>
            </div>
        </div>
    </div>
  );
};


