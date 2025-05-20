// hooks/useMerryLottie.js
import { useState, useEffect } from "react";

// นี่คือ hook เดิม ยังคงใช้สำหรับแสดง Lottie animation เดี่ยวๆ
export function useLottieModal(lottieUrl, duration = 2000) {
  const [showLottie, setShowLottie] = useState(false);
  const [lottieData, setLottieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    const loadLottieAnimation = async () => {
      if (!isBrowser) return;

      try {
        setIsLoading(true);
        const response = await fetch(lottieUrl);

        if (!response.ok) {
          throw new Error(`Failed to load Lottie: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setLottieData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
        setIsLoading(false);
      }
    };

    if (lottieUrl && isBrowser) {
      loadLottieAnimation();
    }
  }, [lottieUrl, isBrowser]);

  const showLottieModal = () => {
    return new Promise((resolve) => {
      setShowLottie(true);

      setTimeout(() => {
        setShowLottie(false);
        resolve();
      }, duration);
    });
  };

  const hideLottieModal = () => {
    setShowLottie(false);
  };

  return {
    showLottie,
    lottieData,
    isLoading,
    showLottieModal,
    hideLottieModal,
  };
}

// Hook ใหม่ที่รองรับทั้งการไลค์และยกเลิกไลค์
export function useMerryLottie(options = {}) {
  const { heartLottieUrl = "/lottie/MerryHeart.json", brokenHeartLottieUrl = "/lottie/MerryBrokenHeart.json", duration = 800 } = options;

  // ใช้ hook เดิมสำหรับแต่ละ animation
  const heart = useLottieModal(heartLottieUrl, duration);
  const brokenHeart = useLottieModal(brokenHeartLottieUrl, duration);

  // ฟังก์ชันสำหรับแสดง animation ตามสถานะการไลค์
  const showLottieBasedOnAction = (isLiking) => {
    if (isLiking) {
      return heart.showLottieModal();
    } else {
      return brokenHeart.showLottieModal();
    }
  };

  return {
    heart,
    brokenHeart,
    showLottieBasedOnAction,
  };
}
