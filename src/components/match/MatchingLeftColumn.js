// components/MatchingLeftColumn.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMerryLike } from "@/context/MerryLikeContext";
import { useMatchedUsers } from "@/hooks/useMatchedUsers";
import { useAuth } from "@/context/AuthContext";
import { encryptUserId, decryptUserId } from "@/utils/crypto";
import ChatRoomList from "@/components/chat/ChatRoomList";
import DiscoverMatchIcon from "../icons/DiscoverMatchIcon";
import DoubleHeartsIcon from "../icons/DoubleHeartsIcon";

export default function MatchingLeftColumn({ onNavigate }) {
  const { userInfo, loading: authLoading } = useAuth();
  const { shouldRefreshMatches } = useMerryLike();
  const { matchedUsers, loading, error } = useMatchedUsers(shouldRefreshMatches);

  const [currentRoomId, setCurrentRoomId] = useState(null);
  const router = useRouter();

  // หา room ID จาก URL parameter
  useEffect(() => {
    const findCurrentRoomId = async () => {
      const { u } = router.query; // encrypted user ID จาก URL

      if (!u || !userInfo?.id) {
        setCurrentRoomId(null);
        return;
      }

      try {
        // Decrypt target user ID
        const targetUserId = decryptUserId(u);

        if (!targetUserId) {
          setCurrentRoomId(null);
          return;
        }

        // เรียก API เพื่อหา room ID
        const response = await fetch("/api/chat/chat-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encryptedTargetUserId: u,
            currentUserId: userInfo.id,
          }),
        });

        const data = await response.json();

        if (data.success && data.chatRoom?.id) {
          setCurrentRoomId(data.chatRoom.id);
        } else {
          setCurrentRoomId(null);
        }
      } catch (error) {
        setCurrentRoomId(null);
      }
    };

    findCurrentRoomId();
  }, [router.query.u, userInfo?.id]);

  const handleStartConversation = (userId) => {
    try {
      const chatToUserID = userId;
      const encryptedId = encryptUserId(chatToUserID);

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

  // แสดง loading ถ้า auth ยังไม่พร้อม
  if (authLoading) {
    return (
      <div className="px-6 pt-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // แสดง error ถ้าไม่มี user
  if (!userInfo?.id) {
    return (
      <div className="px-6 pt-6">
        <div className="text-center text-red-500">Please login to view chats</div>
      </div>
    );
  }

  return (
    <>
      {/* Discover New Match Section */}
      <div className="px-6 pt-6">
        <div className="flex flex-col items-center gap-1 p-4 lg:p-6 bg-[#F6F7FC] border-1 border-[#A62D82] rounded-2xl">
          <DiscoverMatchIcon size={64} primaryColor="#FF1659" secondaryColor="#95002B" />
          <h1 className="text-2xl text-[#95002B] font-bold">Discover New Match</h1>
          <p className="text-sm text-center">Start find and Merry to get know and connect with new friend!</p>
        </div>
      </div>

      <hr className="hidden lg:block text-[#E4E6ED] mt-10 mb-4" />

      {/* Merry Match Section */}
      <div className="px-6 pt-4">
        <h2 className="text-2xl text-[#2A2E3F] font-bold pb-4">Merry Match!</h2>

        {loading && <p>Loading matches...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && matchedUsers && matchedUsers.length === 0 && <p>You don&apos;t have any matches yet</p>}

        {!loading && !error && matchedUsers && matchedUsers.length > 0 && (
          <div className="match-users-container w-full h-32 flex flex-row gap-3 overflow-x-auto whitespace-nowrap">
            {matchedUsers.map((user) => (
              <div key={user.id} className="match-user w-[100px] h-[100px] relative overflow-visible flex-shrink-0">
                <img
                  onClick={() => handleStartConversation(user.id)}
                  src={user.profile_image_url || "/default-avatar.png"}
                  alt={user.name}
                  className="rounded-3xl w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
                <DoubleHeartsIcon size={24} color="#FF1659" className="absolute bottom-0 right-2 translate-x-1/4 translate-y-1/4" />
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="hidden lg:block text-[#E4E6ED] mt-4 mb-8" />

      {/* Chat Rooms Section */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl text-[#2A2E3F] font-bold mb-4">Chat with Merry Match</h2>

        {/* ใช้ ChatRoomList Component - ส่ง currentRoomId ที่หาได้ */}
        <ChatRoomList currentUserId={userInfo.id} activeRoomId={currentRoomId} onNavigate={onNavigate} />
      </div>
    </>
  );
}
