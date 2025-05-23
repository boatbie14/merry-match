import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";

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
    <div className="row mt-30 mb-50 flex flex-col items-center justify-center bg-[#FCFCFE] px-4 py-10 md:flex-row md:gap-20 text-[#4A154B]">
      <div className="text-center md:text-left mb-10 md:mb-0">
        <div className="flex justify-center md:justify-start mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-pink-600">✔</span>
          </div>
        </div>
        <h2 className="subhead mb-1">PAYMENT SUCCESS</h2>
        <h1 className="main-header mb-6">
          Welcome Merry Membership!
          <br /> Thank you for joining us
        </h1>
        <div className="flex justify-center md:justify-start gap-4">
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

      <div className="bg-gradient-to-br from-[#742138] to-[#A878BF] text-white p-6 rounded-2xl max-w-sm shadow-md w-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <h2 className="text-xl font-bold">{data.packages.package_name}</h2>
        </div>
        <p className="text-sm mb-4">
          THB {data.packages.price}.00 <span className="text-xs">/Month</span>
        </p>
        <ul className="text-sm space-y-1 mb-4">
          <li>✔ &quot;Merry&quot; more than a daily limited</li>
          <li>✔ Up to {data.packages.merry_per_day} Merry per day</li>
        </ul>
        <hr className="border-white border-opacity-30 my-2" />
        <div className="text-sm">
          <p className="flex justify-between">
            <span>Start Membership</span>{" "}
            <span>{dayjs(data.start_date).format("DD/MM/YYYY")}</span>
          </p>
          <p className="flex justify-between mt-1">
            <span>Next billing</span>{" "}
            <span>{dayjs(data.end_date).format("DD/MM/YYYY")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
