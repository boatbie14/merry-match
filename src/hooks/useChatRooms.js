// hooks/useChatRooms.js
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const useChatRooms = (currentUserId) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  // ใช้ useCallback เพื่อป้องกัน infinite re-render
  const fetchChatRooms = useCallback(async () => {
    if (!currentUserId) {
      setChatRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = `${window.location.origin}/api/chat/rooms`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: currentUserId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Force state update ด้วย function update pattern
        setChatRooms((prevRooms) => {
          const newRooms = data.chatRooms || [];
          return newRooms;
        });
      } else {
        throw new Error(data.message || "API returned success: false");
      }
    } catch (err) {
      console.error("❌ fetchChatRooms error:", err);
      setError(err.message);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Real-time subscription - เฉพาะการเปลี่ยนแปลงที่สำคัญ
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    // Cleanup subscription เก่า
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // สร้าง subscription ใหม่
    const channelName = `chat-updates-${currentUserId}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      // Subscribe chat_rooms UPDATE - เมื่อมีการอัปเดต last_message
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          const { user1_id, user2_id, is_match } = payload.new || {};

          // เฉพาะ room ที่เป็นของ user นี้ และ is_match = true
          if ((user1_id === currentUserId || user2_id === currentUserId) && is_match) {
            // ใช้ setTimeout เพื่อให้ database commit เสร็จก่อน
            setTimeout(() => {
              fetchChatRooms();
            }, 100);
          }
        }
      )
      // Subscribe messages INSERT - เมื่อมีข้อความใหม่
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const { sender_id, receiver_id } = payload.new || {};

          // เฉพาะข้อความที่เกี่ยวข้องกับ user นี้
          if (sender_id === currentUserId || receiver_id === currentUserId) {
            // ใช้ setTimeout เพื่อให้ trigger อัปเดต chat_rooms เสร็จก่อน
            setTimeout(() => {
              fetchChatRooms();
            }, 200);
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("❌ Subscription error");
        } else if (status === "TIMED_OUT") {
          console.error("⏰ Subscription timed out");
          // ลองต่อใหม่
          setTimeout(() => {
            fetchChatRooms();
          }, 1000);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUserId, fetchChatRooms]);

  // Initial fetch
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  return {
    chatRooms,
    loading,
    error,
    refreshChatRooms: fetchChatRooms,
  };
};
