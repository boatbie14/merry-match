// components/Chat.js
import { useState } from "react";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function Chat({ chatData, currentUser }) {
  const [newMessage, setNewMessage] = useState("");

  // ดึงข้อมูลจาก props
  const senderId = currentUser?.id;
  const receiverId = chatData?.targetUser?.id;
  const username = currentUser?.name || "Unknown";
  const roomId = chatData?.chatRoom?.id;

  // ใช้ custom hook สำหรับจัดการ chat
  const { messages, loading, error, sending, sendMessage, isOwnMessage, messagesEndRef, clearError } = useChatMessages(
    senderId,
    receiverId,
    username,
    roomId
  );

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!senderId || !receiverId || !roomId) {
    return (
      <div className="p-4">
        <p className="text-gray-500">กำลังโหลดข้อมูลแชท...</p>
      </div>
    );
  }

  // Handle form submission
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage(""); // ล้างฟอร์มเมื่อส่งสำเร็จ
    }
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full flex flex-col">
      {/* แสดงข้อผิดพลาด (ถ้ามี) */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 m-4 rounded flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* กล่องข้อความ */}
      <div className="flex-1 p-4 overflow-y-auto">
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
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 p-2 border rounded"
            disabled={loading || sending}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || sending || !newMessage.trim()}
          >
            {sending ? "กำลังส่ง..." : "ส่ง"}
          </button>
        </form>
      </div>
    </div>
  );
}
