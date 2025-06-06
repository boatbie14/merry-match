// hooks/useChatMessages.js
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const useChatMessages = (senderId, receiverId, username, roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const currentRoomIdRef = useRef(roomId); // 🔧 FIX: เก็บ current roomId

  // โหลดข้อความ
  const loadMessages = async () => {
    if (!senderId || !receiverId || !roomId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/chat/get-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          room_id: roomId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError("ไม่สามารถโหลดข้อความได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อความ");
    } finally {
      setLoading(false);
    }
  };

  // ส่งข้อความ (รองรับทั้งข้อความและรูป)
  const sendMessage = async (content, imageUrl = null) => {
    // ตรวจสอบว่ามีข้อความหรือรูป
    if ((!content || !content.trim()) && !imageUrl) return false;
    if (!senderId || !receiverId || !roomId || sending) return false;

    try {
      setSending(true);
      setError(null);

      // กำหนดประเภทข้อความ
      const messageType = imageUrl ? "image" : "text";
      const messageContent = content?.trim() || null;

      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          room_id: roomId,
          content: messageContent,
          message_type: messageType,
          image_url: imageUrl,
          username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // เพิ่มข้อความที่ส่งเข้าไปในรายการทันที (optimistic update)
        setMessages((prev) => [...prev, data.message]);
        return true;
      } else {
        setError("ไม่สามารถส่งข้อความได้");
        return false;
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งข้อความ");
      return false;
    } finally {
      setSending(false);
    }
  };

  // ฟังก์ชันดึง user data จาก public.users
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/users/user?userId=${userId}`, {
        method: "GET",
      });

      const data = await response.json();
      if (data.success && data.user) {
        return {
          id: data.user.id,
          username: data.user.name || data.user.email?.split("@")[0],
          name: data.user.name,
          profile_image_url: data.user.profile_image_url,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // เลื่อนไปที่ข้อความล่าสุด
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ตรวจสอบว่าข้อความเป็นของเราหรือไม่
  const isOwnMessage = (message) => message.sender_id === senderId;

  // 🔧 FIX: useEffect แยกสำหรับ room change detection
  useEffect(() => {
    // ถ้า roomId เปลี่ยน ให้ clear messages และ error
    if (currentRoomIdRef.current !== roomId) {
      console.log(`📨 Messages: Room changed from ${currentRoomIdRef.current} to ${roomId}`);

      // Clear previous data
      setMessages([]);
      setError(null);
      setLoading(true);

      // Cleanup previous subscription
      if (channelRef.current) {
        console.log("🧹 Cleaning up previous messages subscription");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Update current room reference
      currentRoomIdRef.current = roomId;
    }
  }, [roomId]);

  // Setup realtime subscription
  useEffect(() => {
    if (!senderId || !receiverId || !roomId) return;

    // โหลดข้อความเก่า
    loadMessages();

    // ตั้งค่า realtime subscription ที่มี filter
    const channel = supabase
      .channel(`chat-room-messages-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`, // เฉพาะ room นี้
        },
        async (payload) => {
          const message = payload.new;

          // 🔧 FIX: ตรวจสอบว่าข้อความนี้เป็นของ room ปัจจุบันหรือไม่
          if (message.room_id !== currentRoomIdRef.current) {
            console.log(`🚫 Ignoring message from different room: ${message.room_id} vs ${currentRoomIdRef.current}`);
            return;
          }

          // ไม่แสดงข้อความของตัวเอง (เพราะเรา optimistic update ไปแล้ว)
          if (message.sender_id !== senderId) {
            // ดึง sender data
            const senderData = await fetchUserData(message.sender_id);

            setMessages((prev) => {
              // 🔧 FIX: Double check room อีกครั้ง
              if (message.room_id !== currentRoomIdRef.current) {
                console.log("🚫 Message ignored in setState - room mismatch");
                return prev;
              }

              const exists = prev.some((msg) => msg.id === message.id);
              if (exists) return prev;

              return [
                ...prev,
                {
                  ...message,
                  sender: senderData,
                  receiver: null,
                },
              ];
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log("🧹 Cleaning up messages subscription");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [senderId, receiverId, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto scroll เมื่อมีข้อความใหม่
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage, // ตอนนี้รองรับ sendMessage(content, imageUrl)
    isOwnMessage,
    scrollToBottom,
    messagesEndRef,
    // Methods for manual control
    loadMessages,
    clearError: () => setError(null),
  };
};
