import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CancelPage() {
  const router = useRouter();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const raw = router.query.package;
    if (typeof raw === "string") {
      const normalized = raw.toLowerCase().trim();
      setPlan(normalized);

      const timer = setTimeout(() => {
        window.location.href = `/payment?package=${normalized}`;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router.isReady, router.query.package]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FCFCFE] px-6 py-12">
      <div className="bg-white border border-[#E3E6EF] shadow-md rounded-2xl max-w-md w-full px-8 py-10 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-[#A62D82] mb-4">Payment Canceled</h1>
        <p className="text-[#424C6B] mb-6 text-sm leading-relaxed">
          Your transaction was canceled or an error occurred during payment.
          <br />
          {plan
            ? "You’ll be redirected shortly, or click below to retry now."
            : "You can choose another plan below."}
        </p>

        <div className="flex flex-col gap-3">
          {plan && (
            <button
              onClick={() =>
                window.location.href = `/payment/${plan}`
              }
              className="bg-[#A62D82] hover:bg-[#922672] text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Try Again Now
            </button>
          )}
          <Link
            href="/merry-package"
            className="inline-block border border-[#A62D82] text-[#A62D82] hover:text-white hover:bg-[#A62D82] font-medium px-6 py-2 rounded-lg transition"
          >
            Choose Another Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
