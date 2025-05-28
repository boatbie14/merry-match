// hooks/useChatRooms.js
import { useState, useEffect, useRef } from "react";
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

  const fetchChatRooms = async () => {
    if (!currentUserId) {
      console.log("⏳ No user ID provided, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 Starting fetch for user:", currentUserId);

      setLoading(true);
      setError(null);

      // เพิ่ม absolute URL เผื่อมีปัญหา relative path
      const apiUrl = `${window.location.origin}/api/chat/rooms`;
      console.log("📡 Fetching from:", apiUrl);

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

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Success data:", data);

      if (data.success) {
        setChatRooms(data.chatRooms || []);
        console.log(`✅ Set ${data.chatRooms?.length || 0} chat rooms`);
      } else {
        throw new Error(data.message || "API returned success: false");
      }
    } catch (err) {
      console.error("💥 Complete error object:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription สำหรับ messages
  useEffect(() => {
    if (!currentUserId) return;

    // ตั้งค่า realtime subscription สำหรับ messages
    const channel = supabase
      .channel("chat-rooms-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("📩 New message received:", payload);
          // Refresh chat rooms เมื่อมี message ใหม่
          fetchChatRooms();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          console.log("🏠 New chat room created:", payload);
          // Refresh chat rooms เมื่อมี room ใหม่
          fetchChatRooms();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          console.log("🔄 Chat room updated:", payload);
          // Refresh chat rooms เมื่อ room มีการ update
          fetchChatRooms();
        }
      )
      .subscribe();

    channelRef.current = channel;
    console.log("🔌 Subscribed to chat rooms updates");

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        console.log("🔌 Unsubscribed from chat rooms updates");
      }
    };
  }, [currentUserId]);

  // Initial fetch
  useEffect(() => {
    console.log("🔄 Effect triggered:", { currentUserId });
    if (currentUserId) {
      fetchChatRooms();
    } else {
      console.log("❌ No user ID, clearing state");
      setChatRooms([]);
      setLoading(false);
      setError(null);
    }
  }, [currentUserId]);

  return {
    chatRooms,
    loading,
    error,
    refreshChatRooms: fetchChatRooms,
  };
};
