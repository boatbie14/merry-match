// hooks/useChatUser.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@supabase/supabase-js";

// 🔥 NEW: เพิ่ม Supabase client สำหรับ realtime
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to setup chat room");
        }

        if (data.success) {
          setChatData(data);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (err) {
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

  // 🔥 NEW: Realtime subscription for chat_rooms
  useEffect(() => {
    if (!chatData?.chatRoom?.id) return;

    console.log("🔥 Setting up realtime subscription for room:", chatData.chatRoom.id);

    const channel = supabase
      .channel(`chat-room-${chatData.chatRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${chatData.chatRoom.id}`, // ฟังเฉพาะ room นี้
        },
        (payload) => {
          console.log("✅ Realtime update received:", payload.new);

          // 🎯 Update chatData with new room data
          setChatData((prev) => ({
            ...prev,
            chatRoom: {
              ...prev.chatRoom,
              ...payload.new, // merge ข้อมูลใหม่
            },
          }));
        }
      )
      .on("subscribe", (status, err) => {
        console.log("📡 Subscription status:", status, err);
      })
      .on("error", (error) => {
        console.error("❌ Realtime error:", error);
      })
      .subscribe();

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [chatData?.chatRoom?.id]);

  return {
    chatData,
    loading,
    error,
    currentUser: userInfo,
  };
};
