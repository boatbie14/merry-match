import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function PaymentPage() {
  const router = useRouter();
  const { package: plan } = router.query;
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(false);

  const priceMap = {
    basic: 59,
    platinum: 99,
    premium: 149,
  };

  const benefitMap = {
    basic: "Up to 25 Merry per day",
    platinum: "Up to 45 Merry per day",
    premium: "Up to 70 Merry per day",
  };

  const handleCheckout = async () => {
    if (!userInfo?.id || !plan) return;

    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userInfo.id,
        plan,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-10 gap-10 mt-30">
      <div className="bg-gray-50 p-6 rounded-xl shadow-md w-full max-w-sm">
        <p className="font-bold text-lg mb-1">Merry Membership</p>
        <div>
            <p className="text-gray-500 capitalize text-xs mb-2">package </p>
            <p className="text-gray-600 capitalize mb-2">{plan}</p>
        </div>

        <ul className="text-sm text-gray-500 list-disc pl-5 mb-2 bg-white rounded-xl">
          <li>&#39;Merry&#39; more than a daily limited</li>
          <li>{benefitMap[plan]}</li>
        </ul>
        <div className="flex justify-between items-center">
            <p className="text-gray-600 text-xs">Price (Monthly)</p>
             <p className="font-semibold text-lg">
          THB {priceMap[plan]}.00 / month
        </p>
        </div>
       
      </div>

      <div className="bg-white border p-6 rounded-xl shadow-md w-full max-w-sm">
        <p className="font-medium mb-2 text-center">ชำระผ่าน Stripe</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="primary-btn w-full"
        >
          {loading ? "กำลังพาไปหน้า Stripe..." : "Payment Confirm"}
        </button>

        <button
          onClick={() => router.push("/merry-membership")}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
