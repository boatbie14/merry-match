import { useRouter } from "next/router";
import { PackageLongCard } from "@/components/card/PackageCard";
import { AlertPopup } from "@/components/popup/AlertPopup";
import { useState } from "react";
import { billingPDF, cancelSubscription } from "@/services/paymentServices";
import { PdfRequestPopup } from "@/components/popup/PdfRequestPopup";
import { LoadingPop } from "@/components/popup/LoadingPop";
import { Snackbar, Alert } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHistoryPayment } from "@/services/paymentServices";
import { Skeleton } from "@mui/material";
import { getPackageNow } from "@/services/packageServices";
import { formatDateToUserTimezone } from "@/utils/functionCalculate/formatDateToUserTimezone";

function formatPaymentHistory(payments) {
  return payments.map((item) => {
    const date = new Date(item.created_at); // Supabase ส่งมาเป็น string (UTC)
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return {
      subscription_id: item.subscription_id,
      plan: item.plan,
      amount_paid: item.amount_paid,
      created_at: formattedDate,
      invoice_pdf: item?.invoice_pdf,
    };
  });
}

export default function HistoryPage() {
  const router = useRouter();
  const { isLoggedIn, checkingLogin } = useAuth();
  const [dataHistoryPayment, setDataHistoryPayment] = useState([]);
  const [packageNow, setPackageNow] = useState();
  const [packagInSubscriptions, setPackagInSubscriptions] = useState();
  const [isAlertPopup, setIsAlertPopup] = useState(false);
  const [isPdfRequestPopup, setIsPdfRequestPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (!checkingLogin && !isLoggedIn) {
      router.push("/login");
    }
  }, [checkingLogin, isLoggedIn, router]);

  useEffect(() => {
    const fetchPackageNow = async () => {
      try {
        let packageNowTemp = await getPackageNow();
        setPackageNow(packageNowTemp[0].user_packages[0]);
        setPackagInSubscriptions(packageNowTemp[0].stripe_subscriptions[0]);
        console.log(packageNowTemp[0]);
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    const fetchHistoryPayment = async () => {
      try {
        setIsLoadingTable(true);
        let historyTemp = await getHistoryPayment();
        historyTemp = formatPaymentHistory(historyTemp);
        setDataHistoryPayment(historyTemp);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoadingTable(false);
      }
    };
    if (isLoggedIn) {
      fetchPackageNow();
      fetchHistoryPayment();
    }
  }, [isLoggedIn, reset]);

  async function showPDF(selectedInvoices) {
    setIsLoading(true);
    const error = await billingPDF(selectedInvoices);
    if (error) {
      console.error("เกิดข้อผิดพลาดในการสร้าง PDF:", error);
      setAlertMessage("An error occurred while generating the PDF.");
    }
    setIsLoading(false);
    setIsPdfRequestPopup(false);
  }

  async function cancelPackage() {
    try {
      setIsLoading(true);
      await cancelSubscription(packagInSubscriptions.stripe_subscription_id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAlertPopup(false);
      setIsLoading(false);
      setReset(!reset);
    }
  }
  return (
    <>
      <AlertPopup
        isOpen={isAlertPopup}
        onClose={() => setIsAlertPopup(false)}
        title={"Cancel Confirmation"}
        description={"Do you sure to cancel Membership to get more Merry?"}
        buttonLeftText={"Yes, I want to cancel"}
        buttonRightText={"No, I still want to be member"}
        buttonLeftClick={() => {
          cancelPackage();
        }}
        buttonRightClick={() => setIsAlertPopup(false)}
      />

      <PdfRequestPopup
        isOpen={isPdfRequestPopup}
        onClose={() => setIsPdfRequestPopup(false)}
        billingData={dataHistoryPayment}
        requsest={(selectedInvoices) => showPDF(selectedInvoices)}
      />
      <LoadingPop isLoading={isLoading} />

      <div className="row pt-[88px] pb-10 bg-[#ffffff] md:bg-[#FCFCFE] ">
        <div className="container flex flex-col items-start md:items-center mt-[80px]">
          <div className="w-full pl-2 md:pl-6 md:flex my-10 md:my-20 ">
            <div className="flex flex-col gap-2 font-bold md:w-full md:break-words ">
              <h4 className="text-[#7B4429] font-semibold text-[14px] lg:text-[18px]">MERRY MEMBERSHIP</h4>
              <h1 className="text-[#A62D82] text-[32px] lg:text-5xl md:text-4xl font-extrabold leading-[1.25]">
                Manage your membership <br className="" />
                and payment method
              </h1>
            </div>
          </div>
          <div className="w-full md:px-5">
            <h2 className="text-[#2A2E3F] text-[24px] font-bold mb-6" style={{ letterSpacing: "-0.02em" }}>
              Merry Membership Package
            </h2>
            <PackageLongCard
              icon={packageNow?.packages?.icon_url}
              packageName={packageNow?.packages?.package_name}
              price={packageNow?.packages?.price}
              detail={packageNow?.packages?.details || []}
              status={packageNow?.package_status}
              period_end={formatDateToUserTimezone(packagInSubscriptions?.current_period_end)}
              period_start={formatDateToUserTimezone(packagInSubscriptions?.current_period_start)}
              canceled={packagInSubscriptions?.canceled_at}
              cancelPackage={() => {
                setIsAlertPopup(true);
              }}
            />
          </div>
          {/* <div className="w-full md:px-5 mt-21">
            <h2 className="text-[#2A2E3F] text-[24px] font-bold mb-6" style={{ letterSpacing: "-0.02em" }} >Payment Method</h2>
            <CreditInfomationCard
              icon="--"
              cardType="Visa"
              expire="04/2025"
              editPaymentMethod={()=>{router.push("/membership/payment")}}  
            />
          </div> */}
        </div>

        {dataHistoryPayment.length>0 &&
          <div className="w-full mt-20  flex flex-col items-start md:items-center ">
            <div className="w-full md:max-w-[1246px] md:px-7 md:pb-[112px]">
              <h2 className="text-[#2A2E3F] text-[24px] font-bold mb-2 px-4 md:mb-6" style={{ letterSpacing: "-0.02em" }}>Billing History</h2>
              <div className="md:border border-[#D6D9E4] md:rounded-4xl bg-[#FFFFFF] md:p-8 md:pb-3  max-w-full mx-auto text-sm text-[#3C3C4399] md:mx-4" >
                <div className="font-semibold text-[#646D89] text-[20px] mb-2 md:mb-1 md:pt-1 px-4 md:px-0">
                  {packagInSubscriptions?.canceled_at ? "Subscription ends on" :"Next billing"} : <span className="text-[#646D89]">{formatDateToUserTimezone(packagInSubscriptions?.current_period_end)}</span>
                </div>
                <div className="divide-y divide-[#E4E4EB] border-t-1 border-[#E4E6ED] text-[16px] font-normal md:pt-4 md:pb-2 max-h-[468px] overflow-y-auto">
                  {isLoadingTable
                      ? Array(4).fill(null).map((_,index)=> <Skeleton key={index} variant="rectangular" className="w-full mt-8" height={50} />)
                      :dataHistoryPayment.map((item, index) => (
                        <div  key={index}
                            className={`flex items-center py-3 md:py-4 rounded-md px-4 ${
                            index % 2 !== 0 ? "bg-[#F5F5FA]" : ""
                            }`}
                      >
                      <span className="md:flex-[0] pr-9  ">{item.created_at}</span>
                      <span className="flex-[1] text-left">{item.plan?.charAt(0).toUpperCase() + item.plan?.slice(1)}</span>
                      <span className="text-right text-[#424C6B]">THB {item.amount_paid.toFixed(2)}</span>
                    </div>
                    ))}
              </div>

              <div className="flex justify-start pl-4 pt-2 pb-4 border-t border-[#E4E4EB] mt-4 md:pt-6 md:items-center md:justify-end">
                <button
                  onClick={() => {
                    setIsPdfRequestPopup(true);
                  }}
                  className="text-[#C70039] font-bold text-sm md:text-[16px] md:pr-2 hover:underline"
                >
                  Request PDF
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>

      <Snackbar
        className="mt-[100px]"
        open={!!alertMessage}
        autoHideDuration={4000}
        onClose={() => setAlertMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setAlertMessage("")} severity="error" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
