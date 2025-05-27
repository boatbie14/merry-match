// pages/api/chat/get-messages.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id } = req.body;

    console.log("📥 Get messages request:", { sender_id, receiver_id, room_id });

    // Validation
    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sender_id, receiver_id",
      });
    }

    // วิธีที่ 1: ใช้ explicit join syntax
    let query = supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        receiver_id,
        room_id,
        content,
        username,
        chat_status,
        created_at,
        sender:sender_id!inner(
          id,
          username,
          name,
          profile_image_url
        ),
        receiver:receiver_id!inner(
          id,
          username,
          name,
          profile_image_url
        )
      `)
      .order("created_at", { ascending: true });

    // ถ้ามี room_id ให้ filter ตาม room_id
    if (room_id) {
      query = query.eq("room_id", room_id);
    } else {
      // ถ้าไม่มี room_id ให้ filter ตาม sender/receiver คู่
      query = query.or(
        `and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`
      );
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("❌ Supabase error:", error);
      
      // ถ้า join ไม่ได้ ลองแบบแยก query
      console.log("🔄 Fallback to separate queries...");
      
      // ดึง messages ก่อน
      let fallbackQuery = supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          room_id,
          content,
          username,
          chat_status,
          created_at
        `)
        .order("created_at", { ascending: true });

      if (room_id) {
        fallbackQuery = fallbackQuery.eq("room_id", room_id);
      } else {
        fallbackQuery = fallbackQuery.or(
          `and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`
        );
      }

      const { data: basicMessages, error: basicError } = await fallbackQuery;
      
      if (basicError) {
        console.error("❌ Basic query error:", basicError);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch messages",
          error: basicError.message,
        });
      }

      // ดึง user data แยก
      const userIds = [...new Set([
        ...basicMessages.map(msg => msg.sender_id),
        ...basicMessages.map(msg => msg.receiver_id)
      ])];

      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, username, name, profile_image_url")
        .in("id", userIds);

      if (userError) {
        console.error("❌ Users query error:", userError);
        // ส่งแค่ messages โดยไม่มี user data
        return res.status(200).json({
          success: true,
          messages: basicMessages || [],
          count: basicMessages?.length || 0,
        });
      }

      // รวม data
      const messagesWithUsers = basicMessages.map(message => ({
        ...message,
        sender: users.find(user => user.id === message.sender_id) || null,
        receiver: users.find(user => user.id === message.receiver_id) || null
      }));

      return res.status(200).json({
        success: true,
        messages: messagesWithUsers,
        count: messagesWithUsers.length,
      });
    }

    console.log(`✅ Found ${messages?.length || 0} messages`);

    res.status(200).json({
      success: true,
      messages: messages || [],
      count: messages?.length || 0,
    });
  } catch (error) {
    console.error("💥 Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}