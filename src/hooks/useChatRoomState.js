// hooks/useChatRoomState.js
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const useChatRoomState = (initialChatData) => {
  const [chatData, setChatData] = useState(initialChatData);

  // 🔄 Update chatData เมื่อ prop เปลี่ยน
  useEffect(() => {
    setChatData(initialChatData);
  }, [initialChatData]);

  // 🔥 Realtime subscription for chat_rooms
  useEffect(() => {
    if (!chatData?.chatRoom?.id) return;

    console.log("🔥 Setting up chat room realtime subscription:", chatData.chatRoom.id);

    const channel = supabase
      .channel(`chat-room-state-${chatData.chatRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${chatData.chatRoom.id}`,
        },
        (payload) => {
          console.log("✅ Chat room realtime update:", payload.new);

          // Update chatData with new room data
          setChatData((prev) => ({
            ...prev,
            chatRoom: {
              ...prev.chatRoom,
              ...payload.new,
            },
          }));
        }
      )
      .on("subscribe", (status, err) => {
        console.log("📡 Chat room subscription status:", status, err);
      })
      .on("error", (error) => {
        console.error("❌ Chat room realtime error:", error);
      })
      .subscribe();

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up chat room subscription");
      supabase.removeChannel(channel);
    };
  }, [chatData?.chatRoom?.id]);

  // 🎯 Manual update function (สำหรับ callback)
  const updateChatRoom = (updates) => {
    setChatData((prev) => ({
      ...prev,
      chatRoom: {
        ...prev.chatRoom,
        ...updates,
      },
    }));
  };

  return {
    chatData,
    updateChatRoom,
  };
};
