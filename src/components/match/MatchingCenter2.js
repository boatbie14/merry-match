// components/match/MatchingCenter.js
import React, { useContext } from "react";
import SimpleCard from "./SimpleCard";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { RiMapPin2Fill } from "react-icons/ri";
import { MatchContext } from "../../context/MatchContext";

const MatchingCenter = () => {
  // ใช้ Context แทนการรับ props โดยตรง
  const {
    loading,
    displayedUsers,
    lastDirection,
    imageIndexes,
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
    fetchingMoreUsers,
    noUsersFound,
    waitingForMore,
    resetUsers,
  } = useContext(MatchContext);

  // ใช้เงื่อนไขนี้สำหรับแสดงสถานะการโหลด
  const isLoading = loading || fetchingMoreUsers;

  // ควรแสดง "No more users" เมื่อไม่มีใครแสดงอยู่และกำลังรอข้อมูลเพิ่มเติม
  const showNoMoreUsers = displayedUsers.length === 0 && waitingForMore && !isLoading;

  return (
    <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayedUsers.length > 0 ? (
        <div className="relative mx-auto" style={{ height: "680px", width: "620px", maxWidth: "100%" }}>
          {displayedUsers.map((user) => (
            <div key={user.name} className="relative" style={{ height: "100%", width: "100%" }}>
              <SimpleCard onSwipe={(dir) => handleSwipe(dir, user)} onCardLeftScreen={handleOutOfFrame}>
                <div
                  className="bg-transparent rounded-4xl overflow-hidden h-full flex flex-col"
                  style={{ maxWidth: "620px", maxHeight: "680px" }}
                >
                  {/* Container for image and gradient */}
                  <div className="relative w-full md:rounded-4xl" style={{ height: "640px", overflow: "hidden" }}>
                    {/* แก้ไขการเข้าถึงรูปภาพให้ถูกต้อง */}
                    <img
                      src={getImageUrl(user, imageIndexes[user.name] || 1)}
                      className="w-full h-full object-cover pointer-events-none"
                      alt={`Photo of ${user.name}`}
                      style={{ pointerEvents: "none" }}
                    />

                    {/* Linear Gradient Layer ทับรูป */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(to bottom, #07094100 70%, #390741 100%)",
                        pointerEvents: "none",
                      }}
                    ></div>

                    {/* Check Match */}
                    {user.isMatch ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center mt-24">
                        <img
                          src="./images/merry-match.png"
                          className="w-60 h-auto no-drag"
                          alt="Matching"
                          style={{
                            pointerEvents: "none",
                            WebkitUserDrag: "none",
                            KhtmlUserDrag: "none",
                            MozUserDrag: "none",
                            OUserDrag: "none",
                            userDrag: "none",
                          }}
                        />
                        <button className="secondary-btn mt-6">Start Conversation</button>
                      </div>
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-14 text-white">
                        <div className="flex justify-between items-center">
                          <h5 className="text-3xl font-bold flex gap-4">
                            <div>
                              {user.name}, {user.age}
                            </div>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 cursor-pointer">
                              <AiFillEye size={16} color="#fff" />
                            </button>
                          </h5>
                          {/* Arrow */}
                          <div className="flex justify-between mt-4">
                            <button className="p-2 cursor-pointer" onClick={(e) => handleButtonClick(e, user.name, "prev")}>
                              <FiArrowLeft size={20} color="#ffffff" />
                            </button>
                            <button className="p-2 cursor-pointer" onClick={(e) => handleButtonClick(e, user.name, "next")}>
                              <FiArrowRight size={20} color="#ffffff" />
                            </button>
                          </div>
                        </div>
                        <p className="text-white text-opacity-80 mt-1 flex items-center gap-2">
                          <RiMapPin2Fill size={16} color="#FFFFFFCC" /> {user.city}, {user.country}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Button Area - Show only Match = false */}
                  {!user.isMatch && (
                    <div className="flex flex-row justify-center gap-6 mt-[-40px]">
                      <button
                        className="gray-icon-btn"
                        style={{ width: "80px", height: "80px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // ทำการ swipe left
                          handleSwipe("left", user);
                        }}
                      >
                        <IoCloseOutline size={40} color="#646D89" />
                        <span className="tooltip">Pass</span>
                      </button>

                      <button
                        className="gray-icon-btn"
                        style={{ width: "80px", height: "80px" }}
                        onClick={(e) => handleHeartButton(e, user)}
                      >
                        <GoHeartFill size={40} color="#C70039" />
                        <span className="tooltip">Merry</span>
                      </button>
                    </div>
                  )}
                </div>
              </SimpleCard>
            </div>
          ))}
        </div>
      ) : noUsersFound ? (
        <div className="flex flex-col justify-center items-center h-64 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">No users found</h3>
          <p className="text-lg text-gray-300">We couldn't find anyone matching your preferences.</p>
          <p className="text-lg text-gray-300">Try adjusting your search filters.</p>
        </div>
      ) : showNoMoreUsers ? (
        <div className="flex flex-col justify-center items-center h-64 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">You've seen everyone!</h3>
          <p className="text-lg text-gray-300">Check back later for new people.</p>
          <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white" onClick={resetUsers}>
            Start Over
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {lastDirection && (
        <div className="text-center mt-4 text-white">
          <p>Last swipe: {lastDirection}</p>
        </div>
      )}
      <div className="text-center mt-4 text-[#646D89]">
        <p>
          Merry limit today <span className="text-[#FF1659]">2/20</span>
        </p>
      </div>
    </div>
  );
};

// ฟังก์ชันช่วยในการเข้าถึง URL รูปภาพตามลำดับ
function getImageUrl(user, imageIndex) {
  // สร้างอาร์เรย์ของรูปภาพที่มี
  const imageUrls = [
    user.picture, // profile_image_url
    user.originalProfile.image2_url,
    user.originalProfile.image3_url,
    user.originalProfile.image4_url,
    user.originalProfile.image5_url,
  ].filter((url) => url); // กรองเอาเฉพาะ URL ที่มีค่า

  // ถ้าไม่มีรูปภาพหรือ index เกินขนาด ให้คืนรูปแรก
  if (imageUrls.length === 0 || imageIndex < 1 || imageIndex > imageUrls.length) {
    return user.picture;
  }

  // คืนรูปตาม index (ลบ 1 เพราะอาร์เรย์เริ่มที่ 0)
  return imageUrls[imageIndex - 1];
}

export default MatchingCenter;
