import React, { useState } from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import Chat from "@/components/chat/ChatBox";
import { useChatUser } from "@/hooks/useChatUser";
import { useChatUserDetail } from "@/hooks/useChatUserDetail";
import DoubleHeartsIcon from "@/components/icons";
import { GoChevronLeft } from "react-icons/go";

export default function MatchPage() {
  const { chatData, loading: chatLoading, error: chatError, currentUser } = useChatUser();
  const { chatUserDetail, loading: userDetailLoading, error: userDetailError, getChatUserName } = useChatUserDetail();

  // State สำหรับควบคุมการแสดง/ซ่อน left panel บน mobile
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  // รวม loading states
  const isLoading = chatLoading || userDetailLoading;
  const hasError = chatError || userDetailError;

  console.log("🏠 Chat Page State:", {
    chatData: !!chatData,
    currentUser: !!currentUser,
    chatUserDetail,
    isLoading,
    hasError,
  });

  return (
    <div className="row pt-[52px] md:pt-[88px]">
      <div className="container-full flex flex-col xl:flex-row relative">
        {/* Left Panel - แสดงปกติบน Desktop, แสดงแบบ slide บน Mobile */}
        <div
          id="match-chat"
          className={`
            hidden lg:block w-full xl:w-3/12 xl:block
            lg:relative lg:transform-none lg:transition-none
            ${showLeftPanel ? "lg:hidden" : ""}
          `}
        >
          <MatchingLeftColumn />
        </div>

        {/* Mobile Sliding Panel */}
        <div
          className={`
            fixed top-[52px] left-0 h-[calc(100vh-52px)] w-full bg-white z-50 
            transform transition-transform duration-300 ease-in-out
            lg:hidden
            ${showLeftPanel ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <MatchingLeftColumn onNavigate={() => setShowLeftPanel(false)} />
        </div>

        {/* Overlay สำหรับ Mobile เมื่อ panel เปิด */}
        {showLeftPanel && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowLeftPanel(false)} />}

        <div id="chat-container" className="w-full bg-[#150404] xl:w-9/12 h-[calc(100vh-52px)] lg:h-[calc(100vh-88px)] relative">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}

          {hasError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-500">Error loading chat:</p>
                {chatError && <p className="text-sm text-red-400 mt-1">Chat: {chatError}</p>}
                {userDetailError && <p className="text-sm text-red-400 mt-1">User: {userDetailError}</p>}
              </div>
            </div>
          )}

          {chatData && currentUser && !isLoading && (
            <div className="h-full flex flex-col bg-[#160404]">
              {/* Header Section */}
              <div className="bg-white p-4 lg:hidden">
                <button className="flex flex-row items-center gap-4" onClick={() => setShowLeftPanel(true)}>
                  <GoChevronLeft color="#727B9B" size={20} /> {getChatUserName()}
                </button>
              </div>
              <div className="flex-shrink-0 pt-6 lg:pt-8 pb-4">
                <div className="max-w-[740px] flex flex-row justify-center items-center gap-8 border-1 border-[#DF89C6] bg-[#F4EBF2] rounded-2xl lg:rounded-3xl p-3 lg:p-6 mx-4 lg:mx-auto">
                  <DoubleHeartsIcon size={48} color="#FF1659" />
                  <p className="text-[#64001D] text-xs lg:text-sm ">
                    Now you and <span className="font-semibold">{getChatUserName()}</span> are Merry Match! You can messege something nice
                    and make a good conversation. Happy Merry!
                  </p>
                </div>
              </div>

              {/* Chat Component - ใช้ flex-1 เพื่อให้ใช้พื้นที่ที่เหลือ */}
              <div className="flex-1 min-h-0">
                <Chat chatData={chatData} currentUser={currentUser} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
