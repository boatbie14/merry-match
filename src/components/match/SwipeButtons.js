import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { useMerryLike } from "@/context/MerryLikeContext";
import { useMerryLottie } from "@/hooks/useMerryLottie";
import dynamic from "next/dynamic";

// Load LottieModal ด้วย dynamic import แบบไม่มี SSR
const LottieModal = dynamic(() => import("../LottieModal"), { ssr: false });

const SwipeButtons = ({ user, userID, handleSwipe, handleHeartButton }) => {
  const { toggleLike, isLiked, inProgressIds } = useMerryLike();

  // ใช้ Hook ใหม่ที่รองรับทั้งการไลค์และยกเลิกไลค์
  const { heart, brokenHeart, showLottieBasedOnAction } = useMerryLottie();

  const handleMerryClick = async (e) => {
    e.stopPropagation();

    if (!userID) {
      console.error("User ID is missing");
      return;
    }

    const alreadyLiked = isLiked(userID);

    // เรียกใช้ toggleLike
    toggleLike(userID);

    // แสดง animation ตามสถานะการไลค์
    await showLottieBasedOnAction(!alreadyLiked); // true = กำลังไลค์, false = กำลังยกเลิกไลค์

    // เรียกใช้ handleHeartButton หรือ handleSwipe
    if (handleHeartButton) {
      handleHeartButton(e, user);
    } else if (!alreadyLiked) {
      // เลื่อนการ์ดไปทางขวาเมื่อไลค์เท่านั้น ไม่ใช่เมื่อยกเลิกไลค์
      handleSwipe && handleSwipe("right", user);
    }
  };

  if (!user || user.isMatch) return null;

  return (
    <div className="relative flex flex-row justify-center gap-6 mt-[-40px]">
      {/* Heart Lottie Modal */}
      <LottieModal show={heart.showLottie} lottieData={heart.lottieData} onClose={() => {}} />

      {/* Broken Heart Lottie Modal */}
      <LottieModal show={brokenHeart.showLottie} lottieData={brokenHeart.lottieData} onClose={() => {}} />

      <button
        className="gray-icon-btn"
        style={{ width: "80px", height: "80px" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSwipe && handleSwipe("left", user);
        }}
      >
        <IoCloseOutline size={40} color="#646D89" />
        <span className="tooltip">Pass</span>
      </button>

      <button
        className={`gray-icon-btn ${isLiked(userID) ? "active" : ""}`}
        style={{ width: "80px", height: "80px" }}
        onClick={handleMerryClick}
        disabled={inProgressIds.has(userID)}
      >
        <GoHeartFill size={40} color={isLiked(userID) ? "#fff" : "#C70039"} />
        <span className="tooltip">Merry</span>
      </button>
    </div>
  );
};

export default SwipeButtons;
