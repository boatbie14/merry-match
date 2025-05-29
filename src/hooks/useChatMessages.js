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

  // เลื่อนไปที่ข้อความล่าสุด
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ตรวจสอบว่าข้อความเป็นของเราหรือไม่
  const isOwnMessage = (message) => message.sender_id === senderId;

  // Setup realtime subscription
  useEffect(() => {
    if (!senderId || !receiverId || !roomId) return;

    // โหลดข้อความเก่า
    loadMessages();

    // ตั้งค่า realtime subscription ที่มี filter
    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`, // เฉพาะ room นี้
        },
        (payload) => {
          const message = payload.new;

          // ไม่แสดงข้อความของตัวเอง (เพราะเรา optimistic update ไปแล้ว)
          if (message.sender_id !== senderId) {
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === message.id);
              if (exists) return prev;

              return [
                ...prev,
                {
                  ...message,
                  sender: null,
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
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [senderId, receiverId, roomId]);

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
