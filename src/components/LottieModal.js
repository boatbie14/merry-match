// components/LottieModal.js (ใช้ดีไซน์เดิม + ปรับปรุงเล็กน้อย)
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import Lottie ด้วย dynamic import แบบไม่มี SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LottieModal = ({ show, lottieData, onClose, onComplete = () => {}, duration = null, loop = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  // ตรวจสอบว่าอยู่ในฝั่ง client แล้ว
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto close หลังจาก duration (ถ้ามี)
  useEffect(() => {
    if (show && duration && !loop) {
      const timer = setTimeout(() => {
        onComplete();
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, loop, onComplete, onClose]);

  // Handle animation complete
  const handleAnimationComplete = () => {
    if (!loop) {
      onComplete();
      onClose();
    }
  };

  if (!show || !lottieData || !isMounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80" onClick={onClose}>
      <div className="w-120 h-120 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Lottie
          animationData={lottieData}
          loop={loop}
          autoplay={true}
          onComplete={handleAnimationComplete}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default LottieModal;
