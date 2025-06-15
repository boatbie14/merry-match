// pages/api/chat/send.js
import { createClient } from "@supabase/supabase-js";
import { addNotifications_Log } from "@/utils/query/addNotifications_Log";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 🧹 Content Sanitization Function
function sanitizeContent(input) {
  if (!input) return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // ลบ <script> tags
    .replace(/<[^>]*>/g, "") // ลบ HTML tags ทั้งหมด
    .replace(/javascript:/gi, "") // ลบ javascript: protocol
    .replace(/on\w+\s*=/gi, "") // ลบ event handlers (onclick, onload, etc.)
    .trim();
}

// 🔍 Enhanced Input Validation
function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

function validateUsername(username) {
  if (!username) return true; // optional field
  return username.length <= 50 && !/[<>"'/\\]/.test(username);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id, content, message_type = "text", image_url = null, username } = req.body;

    // 🔍 Enhanced Input Validation
    if (!sender_id || !receiver_id || !room_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sender_id, receiver_id, room_id",
      });
    }

    // ✅ UUID Format Validation
    if (!isValidUUID(sender_id) || !isValidUUID(receiver_id) || !isValidUUID(room_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format. Must be valid UUIDs.",
      });
    }

    // ✅ Username Validation
    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username. Max 50 characters, no special characters allowed.",
      });
    }

    // ✅ Content Length Limit
    if (content && content.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message too long. Maximum 2000 characters allowed.",
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

    // 🧹 Sanitize Content
    const sanitizedContent = sanitizeContent(content);
    const sanitizedUsername = sanitizeContent(username);

    // ✅ Final Content Check after sanitization
    if (message_type === "text" && (!sanitizedContent || !sanitizedContent.trim())) {
      return res.status(400).json({
        success: false,
        message: "Message content is empty after security filtering",
      });
    }

    // 🕵️ Enhanced Security Logging
    const securityLog = {
      action: "send_message_attempt",
      sender_id,
      receiver_id,
      room_id,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown",
      user_agent: req.headers["user-agent"] || "unknown",
      timestamp: new Date().toISOString(),
      message_type,
      content_length: content?.length || 0,
      original_content_length: content?.length || 0,
      sanitized_content_length: sanitizedContent?.length || 0,
      content_was_modified: content !== sanitizedContent,
      has_image: !!image_url,
    };

    console.log("🔍 Security Log:", JSON.stringify(securityLog));

    // ตรวจสอบว่า chat room มีอยู่จริง และ user มีสิทธิ์ใช้
    const { data: chatRoom, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", room_id)
      .or(`user1_id.eq.${sender_id},user2_id.eq.${sender_id}`)
      .single();

    if (roomError || !chatRoom) {
      console.error("🚫 Invalid chat room access attempt:", {
        sender_id,
        room_id,
        error: roomError?.message,
        ip: securityLog.ip,
        timestamp: securityLog.timestamp,
      });

      return res.status(403).json({
        success: false,
        message: "Invalid chat room or no permission",
      });
    }

    // เตรียมข้อมูลสำหรับ insert - ใช้ข้อมูลที่ sanitize แล้ว
    const messageData = {
      sender_id,
      receiver_id,
      room_id,
      message_type,
      content: sanitizedContent || null,
      image_url: image_url || null,
      username: sanitizedUsername || "Unknown",
      sender_ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown",
      chat_status: "sent",
      created_at: new Date().toISOString(),
    };

    // บันทึกข้อความลง database
    const { data: message, error: insertError } = await supabase.from("messages").insert(messageData).select().single();

    if (insertError) {
      console.error("💥 Database insert error:", {
        error: insertError.message,
        sender_id,
        room_id,
        timestamp: new Date().toISOString(),
      });

      return res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: insertError.message,
      });
    }

    // Update chat_rooms พร้อม last_message info
    const { error: updateRoomError } = await supabase
      .from("chat_rooms")
      .update({
        updated_at: new Date().toISOString(),
        is_message: true,
        // เพิ่มข้อมูล last message (แค่ 3 fields)
        last_message_sender_id: message.sender_id,
        last_message_content: message.content,
        last_message_type: message.message_type,
      })
      .eq("id", room_id);

    if (updateRoomError) {
      console.error("⚠️ Failed to update chat room timestamp:", updateRoomError);
    }

    // 🔥 เพิ่ม Manual Trigger - ส่ง broadcast ให้ทุก client
    try {
      const broadcastChannel = supabase.channel(`manual-trigger-${Date.now()}`);

      await broadcastChannel.send({
        type: "broadcast",
        event: "chat_room_updated",
        payload: {
          room_id,
          sender_id,
          receiver_id,
          message_id: message.id,
          timestamp: new Date().toISOString(),
        },
      });

      // ปิด channel หลังใช้งาน
      supabase.removeChannel(broadcastChannel);
    } catch (broadcastError) {
      console.error("❌ Manual broadcast failed:", broadcastError);
      // ไม่ return error เพราะข้อความส่งสำเร็จแล้ว
    }

    // 🎯 Success Logging
    console.log("✅ Message sent successfully:", {
      message_id: message.id,
      sender_id,
      receiver_id,
      room_id,
      timestamp: new Date().toISOString(),
    });

    // ส่ง response กลับไปก่อน
    res.status(200).json({
      success: true,
      message,
      chat_room: {
        ...chatRoom,
        updated_at: new Date().toISOString(),
        is_message: true,
        // เพิ่ม last_message ใน response ด้วย
        last_message_sender_id: message.sender_id,
        last_message_content: message.content,
        last_message_type: message.message_type,
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
    console.error("💥 Send message error:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
