import React from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import Chat from "@/components/chat/chat";
import { useChatUser } from "@/hooks/useChatUser";
import DoubleHeartsIcon from "@/components/icons";

export default function MatchPage() {
  const { chatData, loading, error, currentUser } = useChatUser();

  return (
    <div className="row pt-[52px] md:pt-[88px]">
      <div className="container-full flex flex-col xl:flex-row">
        <div id="match-chat" className="w-full xl:w-3/12 xl:block">
          <MatchingLeftColumn />
        </div>

        <div id="chat-container" className="w-full xl:w-9/12 h-[calc(100vh-88px)] relative">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">กำลังโหลด...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {chatData && currentUser && (
            <div className="h-full flex flex-col bg-[#160404]">
              {/* แสดงข้อมูลพื้นฐาน - ซ่อนได้ถ้าไม่ต้องการ */}
              <div className="hidden p-2 bg-gray-50 border-b text-sm text-gray-600">
                <p>
                  <strong>Room:</strong> {chatData.chatRoom.id}
                </p>
              </div>

              {/* Header Section */}
              <div className="flex-shrink-0 pt-8 pb-4">
                <div className="max-w-[740px] flex flex-row justify-center items-center gap-8 border-1 border-[#DF89C6] bg-[#F4EBF2] rounded-3xl p-6 mx-auto">
                  <DoubleHeartsIcon size={48} color="#FF1659" />
                  <p className="text-[#64001D]">
                    Now you and Daeny are Merry Match! You can messege something nice and make a good conversation. Happy Merry!
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
