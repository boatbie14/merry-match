// components/match/MatchingCenter.js
import React, { useState, useContext } from "react";
import Link from "next/link";
//component
import SimpleCard from "./SimpleCard";
import FilterAndMerryLimit from "./FilterAndMerryLimit";
import SwipeButtons from "./SwipeButtons";
import { ProfilePopup } from "../popup/ProfilePopup";

//icon
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { RiMapPin2Fill } from "react-icons/ri";
import { BsHearts } from "react-icons/bs";

//context
import { SwipeContext } from "@/context/SwipeContext";
import { useAuth } from "@/context/AuthContext";
import { useMerryLike } from "@/context/MerryLikeContext";

const MatchingCenter = ({ onToggleFilter }) => {
  // ใช้ข้อมูลและฟังก์ชันจาก Context
  const {
    users,
    displayedUsers = [],
    lastDirection,
    imageIndexes = {},
    loading,
    error,
    swipeCount = 0, // รับค่า swipeCount
    leftSwipes = 0, // รับค่า leftSwipes
    rightSwipes = 0, // รับค่า rightSwipes
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
    currentMerryLimit,
  } = useContext(SwipeContext) || {};

  // Profile Popup
  const [isProfilePopup, setIsProfilePopup] = useState(false);
  const [DataProfilePopup, setDataProfilePopup] = useState({});

  const handleClickEye = (user) => {
    setDataProfilePopup(user.originalProfile || user);
    setIsProfilePopup(true);
  };

  //Upage Limit
  const { limitReached } = useMerryLike();

  // Check login
  const { isLoggedIn, userInfo, checkingLogin } = useAuth();

  // ถ้ากำลังตรวจสอบสถานะล็อกอิน
  if (checkingLogin) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-[#C70039]"></div>
          <p className="mt-4 text-white">Checking login status...</p>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // ถ้าไม่ได้ล็อกอิน
  if (!isLoggedIn) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64 text-white text-center p-4">
          <h3 className="text-2xl font-bold mb-2">Ready to find your Merry Match?</h3>
          <p className="text-lg text-gray-300 mb-6">Join us and start your journey to meaningful connections!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login" className="secondary-btn w-[200px]">
              Login
            </Link>
            <Link href="/register" className="primary-btn w-[200px]">
              Join Merry Match
            </Link>
          </div>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // แสดงสถานะการโหลดเฉพาะเมื่อกำลังโหลดครั้งแรกและยังไม่มีข้อมูลใดๆ
  if (loading && users.length === 0) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-[#C70039]"></div>
          <p className="mt-4 text-white">Loading users...</p>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // แสดงข้อผิดพลาด
  if (error) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Error</h3>
          <p className="text-lg text-gray-300">{error}</p>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // ไม่มีข้อมูลผู้ใช้เมื่อการโหลดเสร็จสิ้นแล้วเท่านั้น
  if (!loading && (!users || users.length === 0) && (!displayedUsers || displayedUsers.length === 0)) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">No users found</h3>
          <p className="text-lg text-gray-300">We couldn&apos;t find anyone matching your preferences.</p>
          <p className="text-lg text-gray-300">Try adjusting your search filters.</p>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // ไม่มีผู้ใช้ที่จะแสดงเมื่อการโหลดเสร็จสิ้นแล้วและมี users แต่ไม่มี displayedUsers
  if (!loading && users.length > 0 && (!displayedUsers || displayedUsers.length === 0)) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64 text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-[#C70039]"></div>
          <h3 className="text-2xl font-bold my-2">Loading next matches...</h3>
          <p className="text-lg text-gray-300">Please wait while we find more people for you.</p>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // ถ้า Limit ถึง
  if (limitReached || currentMerryLimit.count <= 0) {
    return (
      <div className="w-full bg-[#160404] flex flex-col items-center justify-center h-screen overflow-hidden">
        <div className="flex flex-col max-w-[600px] justify-center items-center text-white text-center">
          <BsHearts size={120} color="#FF1659" className="pb-7" />
          <h3 className="text-2xl font-bold my-2">You&apos;ve reached your Merry limit for today!</h3>
          <p className="text-lg text-gray-300 pb-8">
            Upgrade to Merry Membership to get more Merry each day and boost your chances of matching.
          </p>
          <button href="#" className="primary-btn w-[300px] mb-10">
            Unlock More Merries
          </button>
        </div>
        <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
      </div>
    );
  }

  // แสดงข้อมูลผู้ใช้
  return (
    <div className="matching-card-container overflow-hidden">
      {/* Popup */}
      <ProfilePopup isOpen={isProfilePopup} onClose={() => setIsProfilePopup(false)} items={DataProfilePopup} />

      {/* Debug info */}
      {/*       <div className="absolute top-2 left-2 text-xs text-white bg-black/50 p-1 z-50">
        Users: {users?.length || 0} | Swipe Count: {swipeCount} (L: {leftSwipes}, R: {rightSwipes}) |{" "}
        {lastDirection && <span>Last swipe: {lastDirection}</span>}
      </div> */}

      <div className="matching-card-size relative mx-auto ">
        {displayedUsers.map((user) => (
          <div key={user.originalProfile.id} className="relative" style={{ height: "100%", width: "100%" }}>
            <SimpleCard
              onSwipe={(dir) => handleSwipe && handleSwipe(dir, user)}
              onCardLeftScreen={() => handleOutOfFrame && handleOutOfFrame()}
            >
              <div className="matching-card-size bg-transparent md:rounded-4xl overflow-hidden h-full flex flex-col">
                {/* Container for image and gradient */}
                <div className="relative w-full rounded-b-4xl md:rounded-4xl" style={{ height: "640px", overflow: "hidden" }}>
                  {/* รูปภาพ */}
                  <img
                    src={getImageUrl(user, (imageIndexes && imageIndexes[user.name]) || 1)}
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

                  {/* เพิ่มเงื่อนไขการแสดงผลส่วน match */}
                  {user.isMatch ? (
                    //#### Add: เพิ่มส่วนแสดงผลเมื่อเป็น match
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
                        /* Style อันนี้กันไม่ให้ลาก Element ได้ */
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
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 cursor-pointer"
                            onClick={() => handleClickEye(user)}
                          >
                            <AiFillEye size={16} color="#fff" />
                          </button>
                        </h5>
                        {/* Arrow */}
                        <div className="hidden md:flex justify-between mt-4">
                          <button
                            className="p-2 cursor-pointer"
                            onClick={(e) => handleButtonClick && handleButtonClick(e, user.name, "prev")}
                          >
                            <FiArrowLeft size={20} color="#ffffff" />
                          </button>
                          <button
                            className="p-2 cursor-pointer"
                            onClick={(e) => handleButtonClick && handleButtonClick(e, user.name, "next")}
                          >
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
                {!user.isMatch && (
                  <SwipeButtons
                    user={user}
                    userID={user.originalProfile.id}
                    handleSwipe={handleSwipe}
                    handleHeartButton={handleHeartButton}
                  />
                )}
              </div>
            </SimpleCard>
          </div>
        ))}
      </div>

      <FilterAndMerryLimit onToggleFilter={onToggleFilter} merryLimit={currentMerryLimit} />
    </div>
  );
};

// ฟังก์ชันช่วยในการเข้าถึง URL รูปภาพตามลำดับ
function getImageUrl(user, imageIndex) {
  if (!user) {
    console.log("getImageUrl: user is undefined");
    return "";
  }

  // สร้างอาร์เรย์ของรูปภาพที่มี
  const imageUrls = [
    user.picture, // profile_image_url
    user.originalProfile?.image2_url,
    user.originalProfile?.image3_url,
    user.originalProfile?.image4_url,
    user.originalProfile?.image5_url,
  ].filter((url) => url); // กรองเอาเฉพาะ URL ที่มีค่า

  // ถ้าไม่มีรูปภาพหรือ index เกินขนาด ให้คืนรูปแรก
  if (imageUrls.length === 0 || imageIndex < 1 || imageIndex > imageUrls.length) {
    return user.picture || "";
  }

  // คืนรูปตาม index (ลบ 1 เพราะอาร์เรย์เริ่มที่ 0)
  return imageUrls[imageIndex - 1];
}

export default MatchingCenter;
