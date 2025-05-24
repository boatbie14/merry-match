// hooks/useLottie.js
import { useState, useEffect } from "react";
import { useLottieContext } from "@/context/LottieContext";

export const useLottie = () => {
  const { showAnimation } = useLottieContext();
  const [heartData, setHeartData] = useState(null);
  const [brokenHeartData, setBrokenHeartData] = useState(null);

  // โหลดข้อมูล Lottie
  useEffect(() => {
    const loadLottieData = async () => {
      try {
        const [heartResponse, brokenHeartResponse] = await Promise.all([
          fetch("/lottie/MerryHeart.json"),
          fetch("/lottie/MerryBrokenHeart.json"),
        ]);

        const heartData = await heartResponse.json();
        const brokenHeartData = await brokenHeartResponse.json();

        setHeartData(heartData);
        setBrokenHeartData(brokenHeartData);
      } catch (error) {
        console.error("Error loading Lottie data:", error);
      }
    };

    loadLottieData();
  }, []);

  // เล่น Heart Animation
  const playHeart = () => {
    if (heartData) {
      showAnimation(heartData);
    }
  };

  // เล่น Broken Heart Animation
  const playBrokenHeart = () => {
    if (brokenHeartData) {
      showAnimation(brokenHeartData);
    }
  };

  return {
    playHeart,
    playBrokenHeart,
  };
};
