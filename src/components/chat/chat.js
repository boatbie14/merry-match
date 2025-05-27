// components/Chat.js
import { useState } from "react";
import { useChatMessages } from "@/hooks/useChatMessages";
import { HiPaperAirplane } from "react-icons/hi2";

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
      <div className="flex-1 p-4 overflow-y-auto px-24">
        {loading ? (
          <div className="text-center text-gray-500 py-4">กำลังโหลด...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">ยังไม่มีข้อความ</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`mb-3 ${isOwnMessage(message) ? "text-right" : "text-left"}`}>
              {isOwnMessage(message) ? (
                <span className="inline-block px-6 py-4 max-w-[75%] rounded-tl-[24px] rounded-tr-[24px] rounded-br-none rounded-bl-[24px] bg-[#7D2262] text-white">
                  {/* <div className="text-xs font-bold mb-1">คุณ</div> */}
                  <div>{message.content}</div>
                </span>
              ) : (
                <div className="flex items-end gap-3">
                  <img src={message.sender.profile_image_url} className="rounded-full w-10 h-10 object-cover flex-shrink-0" />
                  <span className="inline-block px-6 py-4 max-w-[75%] rounded-tl-[24px] rounded-tr-[24px] rounded-br-[24px] rounded-bl-none bg-[#EFC4E2] text-black">
                    {/* <div className="text-xs font-bold mb-1">{message.username || "ไม่ระบุชื่อ"}</div> */}
                    <div>{message.content}</div>
                  </span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ฟอร์มส่งข้อความ */}
      <div className="p-4 border-t border-t-[#424C6B] px-24">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 p-2 border-none rounded text-[#9B9EAD] outline-none focus:outline-none"
            disabled={loading || sending}
          />
          <button
            type="submit"
            className="bg-[#C70039] text-white w-12 h-12 flex justify-center items-center rounded-full  hover:bg-[#95002B]"
            disabled={loading || sending || !newMessage.trim()}
          >
            {/* {sending ? "กำลังส่ง..." : "ส่ง"} */}
            <HiPaperAirplane size={24} color="#fff" />
          </button>
        </form>
      </div>
    </div>
  );
}
