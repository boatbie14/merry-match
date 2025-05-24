// pages/chat/index.js
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Chat() {
  // Mock user IDs สำหรับการทดสอบ
  const sender_id = "8ad64c2c-16f7-4e49-be91-a6da370d40db";
  const receiver_id = "04d3a1ca-03c6-494b-8aa8-d13c2f93325a";
  const username = "Boat"; // เพิ่ม username ตามที่คุณต้องการ

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // โหลดข้อความและตั้งค่า realtime subscription
  useEffect(() => {
    // โหลดข้อความเก่า
    loadMessages();

    // ตั้งค่า realtime subscription - แบบไม่ใช้ filter
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("📩 Realtime payload", payload);
          const message = payload.new;

          const involved =
            (message.sender_id === sender_id && message.receiver_id === receiver_id) ||
            (message.sender_id === receiver_id && message.receiver_id === sender_id);

          if (involved) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    console.log("🔌 Channel sub:", channel);

    // ยกเลิกการสมัครเมื่อ component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sender_id]);

  // เลื่อนไปที่ข้อความล่าสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // โหลดข้อความ
  const loadMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/chat/get-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id, receiver_id }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError("ไม่สามารถโหลดข้อความได้");
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อความ");
    } finally {
      setLoading(false);
    }
  };

  // เลื่อนไปที่ข้อความล่าสุด
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ส่งข้อความใหม่
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setError(null);

      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id,
          receiver_id,
          content: newMessage,
          username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // เพิ่มข้อความที่ส่งเข้าไปในรายการทันที
        setMessages((prev) => [...prev, data.message]);
        setNewMessage(""); // ล้างฟอร์ม
      } else {
        setError("ไม่สามารถส่งข้อความได้");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("เกิดข้อผิดพลาดในการส่งข้อความ");
    }
  };

  // ตรวจสอบว่าข้อความเป็นของเราหรือไม่
  const isOwnMessage = (message) => message.sender_id === sender_id;

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-md mx-auto h-screen p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">ห้องแชท (ผู้ส่ง: {username})</h1>

      {/* แสดงข้อผิดพลาด (ถ้ามี) */}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      {/* กล่องข้อความ */}
      <div className="flex-1 bg-gray-50 p-3 rounded-lg mb-4 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-4">กำลังโหลด...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">ยังไม่มีข้อความ</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`mb-2 ${isOwnMessage(message) ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-2 max-w-[75%] rounded-lg ${
                  isOwnMessage(message) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="text-xs font-bold mb-1">{isOwnMessage(message) ? "คุณ" : message.username || "ไม่ระบุชื่อ"}</div>
                <div>{message.content}</div>
                <div className="text-xs opacity-75 mt-1">{formatTime(message.created_at)}</div>
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ฟอร์มส่งข้อความ */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          disabled={loading || !newMessage.trim()}
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}
