// components/LottieContainer.js
import React from "react";
import { useLottieContext } from "@/context/LottieContext";
import LottieModal from "./LottieModal";

const LottieContainer = () => {
  const { currentAnimation, hideAnimation } = useLottieContext();

  return (
    <LottieModal
      show={!!currentAnimation}
      lottieData={currentAnimation}
      onClose={hideAnimation}
      duration={2000} // ปิดอัตโนมัติหลัง 2 วินาที
    />
  );
};

export default LottieContainer;
