import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { AlertPopup } from "@/components/popup/AlertPopup";

export default function PaymentPage() {
  const router = useRouter();
  const { package: rawPackage } = router.query;
  const plan = rawPackage?.toLowerCase()?.trim(); // Normalize input

  const { userInfo, checkingLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [packageDetail, setPackageDetail] = useState(null);

  const showAlert = (title, description) => {
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertOpen(true);
  };

  const price = packageDetail?.price ?? null;
  const benefit = packageDetail
    ? `Up to ${packageDetail.merry_per_day} Merry per day`
    : null;

  const handleCheckout = async () => {
    if (!userInfo?.id || !plan || !price) {
      showAlert(
        "Invalid Input",
        "Missing user information or selected package is invalid."
      );
      return;
    }

    try {
      const res = await fetch("/api/payment/can-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userInfo.id, newPlan: plan }),
      });

      const result = await res.json();

      if (!result.allowed) {
        showAlert("Unable to change your package", result.reason);
        return;
      }
    } catch (err) {
      showAlert(
        "Subscription Check Failed",
        "Unable to verify subscription eligibility. Please try again later."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userInfo.id, plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showAlert(
          "Checkout Error",
          data.error || "Failed to redirect to Stripe."
        );
        setLoading(false);
      }
    } catch (error) {
      showAlert(
        "Server Error",
        "Failed to connect to the payment server. Please try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingLogin && !userInfo?.id) {
      router.push("/login");
    }
  }, [checkingLogin, userInfo, router]);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!plan) return;
      console.log("📦 Fetching plan:", plan);

      try {
        const res = await fetch(`/api/package/${plan}`);
        const data = await res.json();
        console.log("📥 Fetched:", data);

        if (data?.success) {
          setPackageDetail(data.package);
        } else {
          showAlert("Package Error", "Unable to load package information.");
        }
      } catch (err) {
        showAlert("Server Error", "Failed to load package details.");
      }
    };

    fetchPackage();
  }, [plan]);

  if (checkingLogin || !packageDetail) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        ⏳ Loading package information...
      </div>
    );
  }

  if (!userInfo?.id) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-baseline p-10 gap-5 md:mt-30 mt-3">
        <div className="bg-[#F6F7FC] p-6 md:rounded-xl w-screen md:w-full md:max-w-sm md:border border-b border-[#D6D9E4]">
          <div className="flex gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/icons/boxIcon.png"
                alt="Box Icon"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-xl mb-6 text-[#646D89]">
              Merry Membership
            </p>
          </div>

          <div className="flex justify-between mt-3">
            <p className="text-[#646D89] font-normal capitalize mb-2">Package</p>
            <p className="text-[#2A2E3F] font-semibold text-xl capitalize mb-2">
              {plan}
            </p>
          </div>

          <ul className="text font-normal text-[#424C6B] list-disc list-inside pl-4 py-2.5 mt-2 mb-2 bg-white rounded-lg space-y-2">
            <li>{packageDetail.description || "'Merry' more than a daily limit"}</li>
            <li>{benefit}</li>
          </ul>

          <div className="flex justify-between items-center py-6">
            <p className="text-[#646D89] text font-normal">Price (Monthly)</p>
            <p className="font-semibold text-lg">THB {price}.00</p>
          </div>
        </div>

        <div className="md:rounded-xl md:border md:w-full md:max-w-sm border-[#D6D9E4]">
          <div className="bg-[#F6F7FC] p-6 w-screen md:w-full md:rounded-t-xl md:max-w-sm border-b border-[#D6D9E4] flex justify-between items-center">
            <p className="capitalize font-bold text-lg text-[#646D89] mb-2 text-center">
              Pay with card
            </p>
            <div className="relative w-20 h-10">
              <Image
                src="/icons/visaIcon.png"
                alt="Visa Icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex justify-between w-full items-center mt-6 px-6 md:pb-6 md:px-4">
            <button
              onClick={() => router.push("/merry-package")}
              className="ghost-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading || checkingLogin || !userInfo?.id}
              className="primary-btn"
            >
              {loading ? "Redirecting to Stripe..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>

      <AlertPopup
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        description={alertDescription}
        buttonRightText="OK"
        buttonRightClick={() => setAlertOpen(false)}
      />
    </>
  );
}
