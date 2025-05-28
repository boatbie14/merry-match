// pages/api/chat/send.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id, content, message_type = "text", image_url = null, username } = req.body;

    console.log("📤 Send message request:", {
      sender_id,
      receiver_id,
      room_id,
      message_type,
      content: content?.substring(0, 50) + "...",
      image_url: image_url ? "✅ Image attached" : "❌ No image",
      username,
    });

    // Validation
    if (!sender_id || !receiver_id || !room_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sender_id, receiver_id, room_id",
      });
    }

    // ตรวจสอบว่ามีข้อความหรือรูป
    if (message_type === "text" && (!content || !content.trim())) {
      return res.status(400).json({
        success: false,
        message: "Text message requires content",
      });
    }

    if (message_type === "image" && !image_url) {
      return res.status(400).json({
        success: false,
        message: "Image message requires image_url",
      });
    }

    // ตรวจสอบประเภทข้อความ
    const validMessageTypes = ["text", "image"];
    if (!validMessageTypes.includes(message_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message_type. Must be 'text' or 'image'",
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

    // เตรียมข้อมูลสำหรับ insert
    const messageData = {
      sender_id,
      receiver_id,
      room_id,
      message_type,
      content: content?.trim() || null,
      image_url: image_url || null,
      username: username || "Unknown",
      sender_ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown",
      chat_status: "sent",
      created_at: new Date().toISOString(),
    };

    console.log("💾 Inserting message:", messageData);

    // บันทึกข้อความลง database
    const { data: message, error: insertError } = await supabase.from("messages").insert(messageData).select().single();

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: insertError.message,
      });
    }

    // 🆕 Update chat_rooms.updated_at
    console.log("🕒 Updating chat room timestamp for room:", room_id);
    const { error: updateRoomError } = await supabase
      .from("chat_rooms")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", room_id);

    if (updateRoomError) {
      console.error("⚠️ Failed to update chat room timestamp:", updateRoomError);
      // ไม่ throw error เพราะข้อความส่งสำเร็จแล้ว
    } else {
      console.log("✅ Chat room timestamp updated successfully");
    }

    console.log("✅ Message sent successfully:", {
      id: message.id,
      type: message.message_type,
      hasContent: !!message.content,
      hasImage: !!message.image_url,
      roomUpdated: !updateRoomError,
    });

    res.status(200).json({
      success: true,
      message,
      chat_room: {
        ...chatRoom,
        updated_at: new Date().toISOString(), // ส่ง updated_at ใหม่กลับไป
      },
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
