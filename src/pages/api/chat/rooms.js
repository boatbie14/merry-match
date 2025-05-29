// pages/api/chat/rooms.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { user_id } = req.body;

    // Validation
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: user_id",
      });
    }

    // ดึงข้อมูล chat rooms (ตอนนี้มี updated_at แล้ว)
    const { data: rooms, error: roomsError } = await supabase
      .from("chat_rooms")
      .select("id, user1_id, user2_id, created_at, updated_at")
      .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)
      .order("updated_at", { ascending: false });

    if (roomsError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch chat rooms",
        error: roomsError.message,
      });
    }

    if (!rooms || rooms.length === 0) {
      return res.status(200).json({
        success: true,
        chatRooms: [],
        count: 0,
      });
    }

    // ประมวลผลข้อมูลแต่ละ room
    const chatRoomsWithDetails = [];

    for (const room of rooms) {
      try {
        // ดึงข้อความล่าสุดก่อน
        const { data: lastMessages, error: messageError } = await supabase
          .from("messages")
          .select("id, content, message_type, sender_id, created_at")
          .eq("room_id", room.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (messageError) {
          continue; // ข้าม room นี้ถ้า error
        }

        // ถ้าไม่มี message ให้ข้าม room นี้
        if (!lastMessages || lastMessages.length === 0) {
          continue;
        }

        const lastMessage = lastMessages[0];

        // หา user อีกคน
        const otherUserId = room.user1_id === user_id ? room.user2_id : room.user1_id;

        // ดึงข้อมูล user อีกคน
        const { data: otherUser, error: userError } = await supabase
          .from("users")
          .select("id, name, profile_image_url")
          .eq("id", otherUserId)
          .single();

        if (userError) {
          // ใส่ข้อมูล fallback แต่ยังคงแสดง room (เพราะมี message)
        }

        // เพิ่มข้อมูลลงใน array (เฉพาะ room ที่มี message)
        chatRoomsWithDetails.push({
          ...room,
          otherUser: otherUser || {
            id: otherUserId,
            name: "Unknown User",
            profile_image_url: null,
          },
          lastMessage: lastMessage,
        });
      } catch (roomError) {
        // ไม่เพิ่ม room ที่ error เข้าไป
        continue;
      }
    }

    res.status(200).json({
      success: true,
      chatRooms: chatRoomsWithDetails,
      count: chatRoomsWithDetails.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
