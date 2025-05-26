import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import Lottie ด้วย dynamic import แบบไม่มี SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LottieModal = ({ show, lottieData, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);

  // ตรวจสอบว่าอยู่ในฝั่ง client แล้ว
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!show || !lottieData || !isMounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80" onClick={onClose}>
      <div className="w-120 h-120 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Lottie animationData={lottieData} loop={false} autoplay={true} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default LottieModal;
