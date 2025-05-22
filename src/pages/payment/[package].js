import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function PaymentPage() {
  const router = useRouter();
  const { package: rawPlan } = router.query;
  const plan = rawPlan?.toLowerCase()?.trim(); // ป้องกัน case mismatch
  const { userInfo, checkingLogin } = useAuth();

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

  const price = priceMap[plan] ?? null;
  const benefit = benefitMap[plan] ?? null;

  const handleCheckout = async () => {
    console.log("🪪 userId:", userInfo?.id);
    console.log("📦 plan:", plan);
    console.log("💰 priceId exists?", !!priceMap[plan]);

    if (!userInfo?.id || !plan || !priceMap[plan]) {
      alert("❌ ข้อมูลไม่ครบ หรือแพ็กเกจไม่ถูกต้อง");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userInfo.id,
        plan,
      }),
    });

    const data = await res.json();
    console.log("✅ ได้ response:", data);
    console.log("➡️ Redirecting to Stripe:", data.url);
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("❌ เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถไปยัง Stripe ได้"));
      setLoading(false); // ย้อนสถานะกลับ
    }
  };

  // ✅ รอโหลด user ก่อน render
  if (checkingLogin) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        ⏳ กำลังโหลดข้อมูลผู้ใช้...
      </div>
    );
  }

  // ✅ ต้อง login ถึงเข้าได้
  if (!userInfo?.id) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        ❌ กรุณาเข้าสู่ระบบก่อนทำรายการ
      </div>
    );
  }

  // ✅ ถ้า plan ผิด
  if (!plan || !price || !benefit) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        ❌ แพ็กเกจไม่ถูกต้อง หรือไม่มีข้อมูล
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-10 gap-10 md:mt-30 mt-10 row">
      <div className="bg-[#F6F7FC] p-6 md:rounded-xl md:shadow-md w-screen md:w-full md:max-w-sm border-b-1 border-[#D6D9E4]">
        <p className="font-bold text-lg mb-1 text-[#646D89]">Merry Membership</p>
        <div>
          <p className="text-gray-500 capitalize text-xs mb-2">Package</p>
          <p className="text-gray-600 capitalize mb-2">{plan}</p>
        </div>

        <ul className="text-sm text-gray-500 list-disc pl-5 mb-2 bg-white rounded-xl">
          <li>&#39;Merry&#39; more than a daily limited</li>
          <li>{benefit}</li>
        </ul>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-xs">Price (Monthly)</p>
          <p className="font-semibold text-lg">
            THB {price}.00 / month
          </p>
        </div>
      </div>

      <div className="bg-white md:border p-6 w-screen md:rounded-xl md:shadow-md md:w-full md:max-w-sm">
        <p className="font-bold text-lg text-[#646D89] mb-2 text-center">ชำระผ่าน Stripe</p>
        <div className="flex justify-between items-center border-[#D6D9E4]">
          <button
            onClick={() => router.push("/merry-membership")}
            className="mt-4 text-sm ghost-btn"
          >
            Cancel
          </button>

          <button
            onClick={handleCheckout}
            disabled={loading || checkingLogin || !userInfo?.id}
            className="primary-btn"
          >
            {loading ? "กำลังพาไปหน้า Stripe..." : "Payment Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
