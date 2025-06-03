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

    // ดึงข้อมูล chat rooms - เฉพาะ is_match = true
    const { data: rooms, error: roomsError } = await supabase
      .from("chat_rooms")
      .select(
        `
        id, user1_id, user2_id, created_at, updated_at, is_message, is_match,
        last_message_sender_id, last_message_content, last_message_type
      `
      )
      .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)
      .eq("is_match", true) // เฉพาะ room ที่ match แล้ว
      .order("updated_at", { ascending: false }); // เรียงตาม updated_at ล่าสุดก่อน

    if (roomsError) {
      console.error("❌ Error fetching chat rooms:", roomsError);
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
        // หา user อีกคน
        const otherUserId = room.user1_id === user_id ? room.user2_id : room.user1_id;

        // ดึงข้อมูล user อีกคน
        const { data: otherUser, error: userError } = await supabase
          .from("users")
          .select("id, name, profile_image_url")
          .eq("id", otherUserId)
          .single();

        if (userError) {
          console.warn("⚠️ Error fetching user:", otherUserId, userError);
        }

        // สร้าง lastMessage object จากข้อมูลใน chat_rooms
        let lastMessage = null;

        // ตรวจสอบว่ามี last_message_type หรือ last_message_content
        if (room.last_message_type || room.last_message_content || room.last_message_sender_id) {
          lastMessage = {
            content: room.last_message_content, // อนุญาตให้เป็น null ได้
            message_type: room.last_message_type || "text",
            sender_id: room.last_message_sender_id,
            created_at: room.updated_at, // ใช้ updated_at เป็นเวลาของข้อความ
          };
        }

        // เพิ่มข้อมูลลงใน array
        chatRoomsWithDetails.push({
          id: room.id,
          user1_id: room.user1_id,
          user2_id: room.user2_id,
          created_at: room.created_at,
          updated_at: room.updated_at,
          is_message: room.is_message,
          is_match: room.is_match,
          otherUser: otherUser || {
            id: otherUserId,
            name: "Unknown User",
            profile_image_url: null,
          },
          lastMessage: lastMessage,
        });
      } catch (roomError) {
        console.error("❌ Error processing room:", room.id, roomError);
        continue;
      }
    }

    res.status(200).json({
      success: true,
      chatRooms: chatRoomsWithDetails,
      count: chatRoomsWithDetails.length,
    });
  } catch (error) {
    console.error("❌ Chat rooms API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
