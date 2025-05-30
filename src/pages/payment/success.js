import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import Image from "next/image";

export default function SuccessPage() {
  const { userInfo } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userInfo?.id) return;
    const fetchData = async () => {
      const { data: result } = await supabase
        .from("user_packages")
        .select(
          "start_date, end_date, packages(package_name, price, merry_per_day, description)"
        )
        .eq("user_id", userInfo.id)
        .order("start_date", { ascending: false })
        .limit(1)
        .single();
      setData(result);
    };
    fetchData();
  }, [userInfo]);

  if (!data)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="mt-10 mb-10 px-4 py-10 bg-[#FCFCFE] text-[#4A154B] flex flex-col items-center justify-center md:flex-row md:items-start md:justify-center md:mt-32 md:mb-52">
  <div className="w-full max-w-6xl flex flex-col md:flex-row md:gap-20 md:justify-between">
    {/* LEFT */}
    <div className="w-full md:w-2/2 text-left mb-10 md:mb-0">
      <div className="flex justify-start mb-4">
         <div className="relative w-16 h-16">
                    {" "}
                    <Image
                      src="/icons/successIcon.png"
                      alt="Success Icon"
                      fill
                      className="object-contain" 
                    />
                  </div>
      </div>
      <h2 className="subhead mb-1">PAYMENT SUCCESS</h2>
      <h1 className="main-header mb-1 md:mb-6 max-w-2xs md:max-w-3xl">
        Welcome Merry Membership!
        <br /> Thank you for joining us
      </h1>
      <div className="hidden md:flex md:w-full md:justify-start md:gap-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="secondary-btn"
        >
          Back to home
        </button>
        <button
          onClick={() => (window.location.href = "/profile")}
          className="primary-btn"
        >
          Check Membership
        </button>
      </div>
    </div>

    {/* RIGHT */}
    <div className="w-full md:w-1/2 flex flex-col-reverse items-center md:items-end gap-10">
      <div className="flex w-full justify-between md:hidden">
        <button
          onClick={() => (window.location.href = "/")}
          className="secondary-btn"
        >
          Back to home
        </button>
        <button
          onClick={() => (window.location.href = "/profile")}
          className="primary-btn"
        >
          Check Membership
        </button>
      </div>
      <div className="bg-gradient-to-br from-[#742138] to-[#A878BF] text-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <div className="flex flex-col items-start gap-4 mb-3">
          <div>
            <div className="w-14 h-14 bg-[#F6F7FC] rounded-2xl flex items-center justify-center">
              <span className="text-2xl transform -scale-x-100">✨</span>
            </div>
            <div className="flex flex-col items-start gap-2 mt-4">
              <h2 className="text-3xl font-bold capitalize">
                {data.packages.package_name}
              </h2>
              <p className="text-xl font-semibold">
                THB {data.packages.price}.00{" "}
                <span className="font-normal">/Month</span>
              </p>
            </div>
          </div>
        </div>
        <div className="text-start">
          <ul className="space-y-4 pb-9 font-normal">
            <li>✔ &quot;Merry&quot; more than a daily limited</li>
            <li>✔ Up to {data.packages.merry_per_day} Merry per day</li>
          </ul>
        </div>
        <hr className="border-white border-opacity-30 my-4" />
        <div className="font-normal space-y-1">
          <p className="flex justify-between">
            <span>Start Membership</span>
            <span>{dayjs(data.start_date).format("DD/MM/YYYY")}</span>
          </p>
          <p className="flex justify-between mt-1">
            <span>Next billing</span>
            <span>{dayjs(data.end_date).format("DD/MM/YYYY")}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
