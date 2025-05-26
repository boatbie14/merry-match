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

    let query = supabase
      .from("messages")
      .select(
        `
        id,
        sender_id,
        receiver_id,
        room_id,
        content,
        username,
        chat_status,
        created_at
      `
      )
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
      console.error("Error fetching messages:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error: error.message,
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
