// hooks/useChatUser.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export const useChatUser = () => {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { userInfo, isLoggedIn, checkingLogin } = useAuth();

  useEffect(() => {
    const setupChatRoom = async () => {
      const encryptedId = router.query.u;

      // ตรวจสอบว่า user login แล้วและมี encrypted ID
      if (checkingLogin) return;

      if (!isLoggedIn || !userInfo?.id) {
        setError("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      if (!encryptedId) {
        setError("ไม่พบข้อมูล User ID");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🚀 Calling chat room API...");

        const response = await fetch("/api/chat/chat-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            encryptedTargetUserId: encryptedId,
            currentUserId: userInfo.id,
          }),
        });

        console.log("📡 Response status:", response.status);

        const data = await response.json();
        console.log("📄 Response data:", data);

        if (!response.ok) {
          console.error("❌ API Error Response:", data);
          throw new Error(data.message || "Failed to setup chat room");
        }

        if (data.success) {
          setChatData(data);
          console.log("✅ Chat room ready:", {
            roomId: data.chatRoom.id,
            isNew: data.isNewRoom,
          });
        } else {
          throw new Error("Invalid response data");
        }
      } catch (err) {
        console.error("❌ Complete error object:", err);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error stack:", err.stack);
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    // เรียกใช้เมื่อ router พร้อม และ auth พร้อม
    if (router.isReady && !checkingLogin) {
      setupChatRoom();
    }
  }, [router.isReady, router.query.u, isLoggedIn, userInfo?.id, checkingLogin]);

  return {
    chatData,
    loading,
    error,
    currentUser: userInfo,
  };
};
