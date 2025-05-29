// pages/api/chat/chat-room.js (version with better error handling)
import { createClient } from "@supabase/supabase-js";
import { decryptUserId, isValidEncryptedId } from "@/utils/crypto";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { encryptedTargetUserId, currentUserId } = req.body;

    console.log("Chat room API called with:", { encryptedTargetUserId, currentUserId });

    if (!encryptedTargetUserId || !currentUserId) {
      return res.status(400).json({
        message: "Encrypted target user ID and current user ID are required",
      });
    }

    // ตรวจสอบและ decrypt target user ID
    if (!isValidEncryptedId(encryptedTargetUserId)) {
      return res.status(400).json({ message: "Invalid encrypted target user ID" });
    }

    const targetUserId = decryptUserId(encryptedTargetUserId);
    if (!targetUserId) {
      return res.status(400).json({ message: "Failed to decrypt target user ID" });
    }

    // ป้องกันการสร้าง chat room กับตัวเอง
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Cannot create chat room with yourself" });
    }

    console.log("Decrypted target user ID:", targetUserId);

    // ฟังก์ชันสำหรับหา existing room
    const findExistingRoom = async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${currentUserId})`)
        .maybeSingle();

      if (error) {
        console.error("Error searching for existing room:", error);
        return null;
      }
      return data;
    };

    // ขั้นตอน 1: ลองหาห้องที่มีอยู่ก่อน
    let chatRoom = await findExistingRoom();
    let isNewRoom = false;

    if (!chatRoom) {
      // ขั้นตอน 2: ลองสร้างใหม่
      const { data: newRoom, error: createError } = await supabase
        .from("chat_rooms")
        .insert({
          user1_id: currentUserId,
          user2_id: targetUserId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Create error:", createError);

        // ขั้นตอน 3: ถ้าสร้างไม่ได้ (อาจเป็น constraint) ลองหาอีกครั้ง
        if (
          createError.code === "23505" ||
          createError.message?.includes("duplicate") ||
          createError.message?.includes("idx_chat_rooms_unique_users")
        ) {
          console.log("Constraint violation detected, retrying search...");

          // รอสักครู่เผื่อ concurrent request เสร็จ
          await new Promise((resolve) => setTimeout(resolve, 100));

          chatRoom = await findExistingRoom();

          if (chatRoom) {
            isNewRoom = false;
            console.log("Found existing room after constraint violation:", chatRoom.id);
          } else {
            console.error("Still no room found after constraint violation");
            return res.status(500).json({
              message: "Failed to create or find chat room",
              error: "Constraint violation but no existing room found",
            });
          }
        } else {
          console.error("Non-constraint error:", createError);
          return res.status(500).json({
            message: "Error creating chat room",
            error: createError.message,
            code: createError.code,
          });
        }
      } else {
        chatRoom = newRoom;
        isNewRoom = true;
        console.log("New chat room created successfully:", chatRoom.id);
      }
    } else {
      console.log("Existing chat room found:", chatRoom.id);
    }

    // ตรวจสอบว่าได้ chatRoom แล้ว
    if (!chatRoom) {
      return res.status(500).json({
        message: "Failed to create or retrieve chat room",
      });
    }

    // ดึงข้อมูล user profile ของ target user
    const { data: targetUserProfile, error: profileError } = await supabase
      .from("users")
      .select(
        "id, name, date_of_birth, location, city, sexual_identities, sexual_preferences, racial_preferences, meeting_interests, hobbies, images"
      )
      .eq("id", targetUserId)
      .single();

    if (profileError) {
      console.error("Error fetching target user profile:", profileError);
    }

    console.log("✅ Sending successful response for room:", chatRoom.id);

    res.status(200).json({
      success: true,
      chatRoom,
      targetUser: {
        id: targetUserId,
        profile: targetUserProfile || null,
      },
      currentUserId,
      isNewRoom,
    });
  } catch (error) {
    console.error("💥 Unexpected API error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
