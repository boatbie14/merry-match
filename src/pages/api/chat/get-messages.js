// pages/api/chat/get-messages.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sender_id, receiver_id, room_id } = req.body;

    if (!sender_id || !receiver_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sender_id, receiver_id",
      });
    }

    // ดึง messages ก่อน (แยกออกจาก user data)
    let messagesQuery = supabase
      .from("messages")
      .select(
        `
        id,
        sender_id,
        receiver_id,
        room_id,
        content,
        message_type,
        image_url,
        username,
        chat_status,
        created_at
      `
      )
      .order("created_at", { ascending: true });

    if (room_id) {
      messagesQuery = messagesQuery.eq("room_id", room_id);
    } else {
      messagesQuery = messagesQuery.or(
        `and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`
      );
    }

    const { data: messages, error: messagesError } = await messagesQuery;

    if (messagesError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error: messagesError.message,
      });
    }

    if (!messages || messages.length === 0) {
      return res.status(200).json({
        success: true,
        messages: [],
        count: 0,
      });
    }

    // ดึง user data แยก
    const userIds = [...new Set([...messages.map((msg) => msg.sender_id), ...messages.map((msg) => msg.receiver_id)])];

    const { data: users, error: usersError } = await supabase.from("users").select("id, name, email, profile_image_url").in("id", userIds);

    // รวม data (ถ้าดึง users ไม่ได้ก็ใส่ sender: null)
    const messagesWithUsers = messages.map((message) => ({
      ...message,
      sender: usersError ? null : users?.find((user) => user.id === message.sender_id) || null,
      receiver: usersError ? null : users?.find((user) => user.id === message.receiver_id) || null,
    }));

    res.status(200).json({
      success: true,
      messages: messagesWithUsers,
      count: messagesWithUsers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
