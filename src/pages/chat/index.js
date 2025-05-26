import React from "react";
import MatchingLeftColumn from "@/components/match/MatchingLeftColumn";
import Chat from "@/components/chat/chat";
import { useChatUser } from "@/hooks/useChatUser";

export default function MatchPage() {
  const { chatData, loading, error, currentUser } = useChatUser();

  return (
    <div className="row pt-[52px] md:pt-[88px]">
      <div className="container-full flex flex-col xl:flex-row">
        <div id="match-chat" className="w-full xl:w-3/12 xl:block">
          <MatchingLeftColumn />
        </div>

        <div id="chat-container" className="w-full xl:w-9/12 relative bg-white">
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
            <div className="h-full">
              {/* แสดงข้อมูลพื้นฐาน - ซ่อนได้ถ้าไม่ต้องการ */}
              <div className="p-2 bg-gray-50 border-b text-sm text-gray-600">
                <p>
                  <strong>Room:</strong> {chatData.chatRoom.id}
                </p>
              </div>

              {/* Chat Component */}
              <div className="h-[calc(100vh-140px)]">
                <Chat chatData={chatData} currentUser={currentUser} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
