// pages/api/chat/send.js
import { createClient } from "@supabase/supabase-js";
import { addNotifications_Log } from "@/utils/query/addNotifications_Log";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id, content, message_type = "text", image_url = null, username } = req.body;

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

    // Update chat_rooms.updated_at และ is_message
    const { error: updateRoomError } = await supabase
      .from("chat_rooms")
      .update({
        updated_at: new Date().toISOString(),
        is_message: true, // เพิ่มบรรทัดนี้เพื่อบอกว่ามีการส่งข้อความแล้ว
      })
      .eq("id", room_id);

    if (updateRoomError) {
      console.error("⚠️ Failed to update chat room timestamp:", updateRoomError);
    }

    // ส่ง response กลับไปก่อน
    res.status(200).json({
      success: true,
      message,
      chat_room: {
        ...chatRoom,
        updated_at: new Date().toISOString(),
        is_message: true, // เพิ่มใน response ด้วย
      },
    });

    // ส่ง notification แบบ async หลัง response (ไม่รอผลลัพธ์)
    setImmediate(async () => {
      try {
        const { data: messageCount, error: countError } = await supabase
          .from("messages")
          .select("id", { count: "exact" })
          .eq("room_id", room_id);

        if (!countError) {
          const isFirstMessage = (messageCount?.length || 0) === 1;

          await addNotifications_Log(
            "message", // type
            sender_id, // from_user_id
            receiver_id, // to_user_id
            false, // match
            isFirstMessage // firstMessage
          );
        }
      } catch (notifError) {
        console.error("❌ Async notification error:", notifError);
      }
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
