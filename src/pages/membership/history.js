import { useRouter } from "next/router";
import { PackageLongCard } from "@/components/card/PackageCard";
import { AlertPopup } from "@/components/popup/AlertPopup";
import { useState } from "react";
export default function HistoryPage() {
  const router = useRouter();
  const [isAlertPopup,setIsAlertPopup] = useState(false)

const billingData = [
  { date: "01/08/2022", plan: "Premium", price: "THB 149.00" },
  { date: "01/07/2022", plan: "Premium", price: "THB 149.00" },
  { date: "01/06/2022", plan: "Basic", price: "THB 59.00" },
  { date: "01/05/2022", plan: "Basic", price: "THB 59.00" },
  { date: "01/04/2022", plan: "Basic", price: "THB 59.00" },
];

function cancelPackage () {

}
  return (
  <>
      <AlertPopup
        isOpen={isAlertPopup}
        onClose={()=>setIsAlertPopup(false)}
        title={"Cancel Confirmation"}
        description={"Do you sure to cancel Membership to get more Merry?"}
        buttonLeftText={"Yes, I want to cancel"}
        buttonRightText={"No, I still want to be member"}
        buttonLeftClick={()=>{cancelPackage()}}
        buttonRightClick={()=>setIsAlertPopup(false)}
      />

    <div className="row pt-[88px] pb-10 bg-[#ffffff] md:bg-[#FCFCFE] "> 
        <div className="container flex flex-col items-start md:items-center mt-[80px]">
          <div className="w-full pl-2 md:pl-6 md:flex my-10 md:my-20 ">
              <div className="flex flex-col gap-2 font-bold md:w-full md:break-words ">
                <h4 className="text-[#7B4429] font-semibold text-[14px] lg:text-[18px]">MERRY MEMBERSHIP</h4>
                <h1 className="text-[#A62D82] text-[32px] lg:text-5xl md:text-4xl font-extrabold leading-[1.25]">
                  Manage your membership <br className="" />and payment method</h1>
              </div>
          </div>
          <div className="w-full md:px-5">
              <h2 className="text-[#2A2E3F] text-[24px] font-bold mb-6" style={{ letterSpacing: "-0.02em" }} >Merry Membership Package</h2>
              <PackageLongCard
                icon="--"
                title="Premium"
                price="149.00"
                features={["‘Merry’ more than a daily limited "]}
                status={"Active"}
                cancelPackage={()=>{setIsAlertPopup(true)}}/>
          </div>
        </div>

        <div className="w-full mt-15  flex flex-col items-start md:items-center ">
          <div className="w-full md:max-w-[1246px] md:px-7 md:pb-[112px]">
            <h2 className="text-[#2A2E3F] text-[24px] font-bold mb-2 px-4 md:mb-6" style={{ letterSpacing: "-0.02em" }}>Billing History</h2>
            <div className="md:border border-[#D6D9E4] md:rounded-4xl bg-[#FFFFFF] md:p-8 md:pb-3  max-w-full mx-auto text-sm text-[#3C3C4399] md:mx-4" >
                <div className="font-semibold text-[#646D89] text-[20px] mb-2 md:mb-1 md:pt-1 px-4 md:px-0">
                  Next billing : <span className="text-[#646D89]">01/09/2022</span>
                </div>
                <div className="divide-y divide-[#E4E4EB] border-t-1 border-[#E4E6ED] text-[16px] font-normal md:pt-4 md:pb-2">
                  {billingData.map((item, index) => (
                    <div  key={index}
                          className={`flex justify-between items-center py-3 md:py-4 rounded-md px-4 ${
                          index % 2 !== 0 ? "bg-[#F5F5FA]" : ""
                          }`}
                    >
                    <span className="md:flex-[0] md:pr-8 flex-[1] ">{item.date}</span>
                    <span className="flex-[1] text-left">{item.plan}</span>
                    <span className="text-right text-[#424C6B]">{item.price}</span>
                </div>
                ))}
            </div>

              <div className="flex justify-start pl-4 pt-2 pb-4 border-t border-[#E4E4EB] mt-4 md:pt-6 md:items-center md:justify-end">
                <button className="text-[#C70039] font-bold text-sm md:text-[16px] md:pr-2 hover:underline">
                  Request PDF
                </button>
              </div>
          </div>
        </div>
        </div>
    </div>
  </>
  );
}