// pages/api/chat/send.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id, content, username } = req.body;

    console.log("📤 Send message request:", {
      sender_id,
      receiver_id,
      room_id,
      content: content?.substring(0, 50) + "...",
      username,
    });

    // Validation
    if (!sender_id || !receiver_id || !room_id || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sender_id, receiver_id, room_id, content",
      });
    }

    // ตรวจสอบว่า chat room มีอยู่จริง และ user มีสิทธิ์ใช้
    const { data: chatRoom, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", room_id)
      .or(`user1_id.eq.${sender_id},user2_id.eq.${sender_id}`)
      .single();

    if (roomError || !chatRoom) {
      console.error("Invalid chat room:", roomError);
      return res.status(403).json({
        success: false,
        message: "Invalid chat room or no permission",
      });
    }

    // บันทึกข้อความลง database
    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        sender_id,
        receiver_id,
        room_id,
        content: content.trim(),
        username: username || "Unknown",
        sender_ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown",
        chat_status: "sent",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: insertError.message,
      });
    }

    console.log("✅ Message sent successfully:", message.id);

    res.status(200).json({
      success: true,
      message,
      chat_room: chatRoom,
    });
  } catch (error) {
    console.error("💥 Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
