// hooks/useChatRoomState.js
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const useChatRoomState = (initialChatData) => {
  const [chatData, setChatData] = useState(initialChatData);
  const currentRoomIdRef = useRef(null); // 🔧 FIX: เก็บ current roomId
  const channelRef = useRef(null); // 🔧 FIX: เก็บ channel reference

  // 🔄 Update chatData เมื่อ prop เปลี่ยน และ reset เมื่อเปลี่ยนห้อง
  useEffect(() => {
    const newRoomId = initialChatData?.chatRoom?.id;

    // ถ้า roomId เปลี่ยน ให้ reset state
    if (currentRoomIdRef.current !== newRoomId) {
      // Cleanup previous subscription
      if (channelRef.current) {
        console.log("🧹 Cleaning up previous room subscription");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Update room reference
      currentRoomIdRef.current = newRoomId;
    }

    // อัพเดต chatData
    setChatData(initialChatData);
  }, [initialChatData]);

  // 🔥 Realtime subscription for chat_rooms
  useEffect(() => {
    if (!chatData?.chatRoom?.id) return;

    // ถ้ามี subscription เก่าอยู่ ให้ cleanup ก่อน
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

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
          // 🔧 FIX: ตรวจสอบว่า update นี้เป็นของห้องปัจจุบันหรือไม่
          if (payload.new.id !== currentRoomIdRef.current) {
            return;
          }

          // Update chatData with new room data
          setChatData((prev) => {
            // 🔧 FIX: Double check ว่า prev.chatRoom.id ตรงกับ current room
            if (prev?.chatRoom?.id !== currentRoomIdRef.current) {
              return prev;
            }

            return {
              ...prev,
              chatRoom: {
                ...prev.chatRoom,
                ...payload.new,
              },
            };
          });
        }
      )
      .on("subscribe", (status, err) => {
        console.log("📡 Chat room subscription status:", status, err);
      })
      .on("error", (error) => {
        console.error("❌ Chat room realtime error:", error);
      })
      .subscribe();

    // เก็บ channel reference
    channelRef.current = channel;

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up chat room subscription");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatData?.chatRoom?.id]);

  // 🎯 Manual update function (สำหรับ callback)
  const updateChatRoom = (updates) => {
    // 🔧 FIX: ตรวจสอบว่าเป็น room ปัจจุบันหรือไม่
    setChatData((prev) => {
      if (prev?.chatRoom?.id !== currentRoomIdRef.current) {
        return prev;
      }

      return {
        ...prev,
        chatRoom: {
          ...prev.chatRoom,
          ...updates,
        },
      };
    });
  };

  return {
    chatData,
    updateChatRoom,
  };
};
