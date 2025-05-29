// components/chat/ChatRoomList.js
import React from "react";
import { useRouter } from "next/router";
import { useChatRooms } from "@/hooks/useChatRooms";
import { encryptUserId } from "@/utils/crypto";

export default function ChatRoomList({ currentUserId, activeRoomId = null, onNavigate }) {
  const { chatRooms, loading, error } = useChatRooms(currentUserId);
  const router = useRouter();

  // ฟังก์ชันเปิดการสนทนา
  const handleOpenChat = (otherUserId) => {
    try {
      const encryptedId = encryptUserId(otherUserId);
      if (encryptedId) {
        // เรียก onNavigate เพื่อปิดเมนูซ้าย (สำหรับ mobile)
        if (onNavigate) {
          onNavigate();
        }
        router.push(`/chat?u=${encryptedId}`);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  // ฟังก์ชันจัดรูปแบบข้อความล่าสุด
  const formatLastMessage = (message, isOwnMessage) => {
    if (!message) return "No messages yet";

    let content = "";

    // กำหนด content ตามประเภทข้อความ
    if (message.message_type === "image") {
      content = "📷 Image";
    } else {
      content = message.content || "";
    }

    // จำกัดความยาวไม่เกิน 80 ตัวอักษร
    if (content.length > 80) {
      content = content.substring(0, 77) + "...";
    }

    // เพิ่ม "You: " ถ้าเป็นข้อความของเรา
    if (isOwnMessage) {
      return `You: ${content}`;
    }

    return content;
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const messageDate = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - messageDate) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        // แสดงเวลา ถ้าเป็นวันเดียวกัน
        return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (diffInHours < 24 * 7) {
        // แสดงวัน ถ้าเป็นสัปดาห์เดียวกัน
        return messageDate.toLocaleDateString([], { weekday: "short" });
      } else {
        // แสดงวันที่ ถ้าเก่ากว่า 1 สัปดาห์
        return messageDate.toLocaleDateString([], { month: "short", day: "numeric" });
      }
    } catch (err) {
      return "";
    }
  };

  if (!currentUserId) {
    return (
      <div className="chat-room-list max-h-60 overflow-y-auto">
        <div className="text-center py-4 text-red-500">
          <p>❌ No user ID</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-room-list max-h-60 overflow-y-auto">
        <div className="text-center py-4 text-gray-500">
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-room-list max-h-60 overflow-y-auto">
        <div className="text-center py-4 text-red-500">
          <p>❌ Error loading chats</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="chat-room-list max-h-60 overflow-y-auto">
        <div className="text-center py-4 text-gray-500">
          <p>No conversations yet</p>
          <p className="text-xs mt-1">Start matching to begin chatting!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-xs text-gray-400 mb-2 px-1">Found {chatRooms.length} chats</div>
      <div className="chat-room-list max-h-[168px] overflow-y-auto pb-4">
        <div className="space-y-1">
          {chatRooms.map((room) => {
            const { otherUser, lastMessage } = room;
            const isActive = activeRoomId === room.id;
            const isOwnMessage = lastMessage?.sender_id === currentUserId;

            return (
              <div
                key={room.id}
                onClick={() => otherUser && handleOpenChat(otherUser.id)}
                className={`room-item flex flex-row items-center gap-4 py-4 px-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-2xl ${
                  isActive ? "bg-[#F6F7FC] border-1 border-[#A62D82]" : ""
                }`}
              >
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={otherUser?.profile_image_url || "https://via.placeholder.com/48x48?text=U"}
                    alt={otherUser?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48x48?text=U";
                    }}
                  />
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-[#2A2E3F] font-medium truncate">{otherUser?.name || "Unknown User"}</p>
                    {lastMessage && <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatTime(lastMessage.created_at)}</span>}
                  </div>

                  <p className="text-[#646D89] text-sm truncate mt-1">{formatLastMessage(lastMessage, isOwnMessage)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
