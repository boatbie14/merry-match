// components/match/SwipeButtons.js (ลบ Lottie ออก)
import React from "react";
import { useMerryLike } from "@/context/MerryLikeContext";
import { IoCloseOutline } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";

const SwipeButtons = ({ user, userID, handleSwipe, handleHeartButton }) => {
  const { isLiked } = useMerryLike();

  const handleMerryClick = async (e) => {
    e.stopPropagation();

    if (!userID) {
      console.error("User ID is missing");
      return;
    }

    const alreadyLiked = isLiked(userID);

    // ไม่ต้องเรียก toggleLike ที่นี่ เพราะ handleSwipe จะจัดการให้

    // เรียกใช้ handleHeartButton หรือ handleSwipe
    if (handleHeartButton) {
      handleHeartButton(e, user);
    } else if (!alreadyLiked) {
      // เลื่อนการ์ดไปทางขวาเมื่อไลค์เท่านั้น ไม่ใช่เมื่อยกเลิกไลค์
      handleSwipe && handleSwipe("right", user);
    }

    // ไม่ต้องเรียก refreshMerryLimit ที่นี่ เพราะ handleSwipe จะจัดการให้
  };

  if (!user || user.isMatch) return null;

  return (
    <div className="relative flex flex-row justify-center gap-6 mt-[-40px]">
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
        disabled={isLiked(userID)}
      >
        <GoHeartFill size={40} color={isLiked(userID) ? "#fff" : "#C70039"} />
        <span className="tooltip">Merry</span>
      </button>
    </div>
  );
};

export default SwipeButtons;
