// pages/api/match-list.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // รับ user_id จาก query parameter
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id parameter" });
  }

  try {
    // 1. ดึงรายการที่ user_id ปัจจุบันกด like ใครไปบ้าง (from_user_id -> to_user_id)
    const { data: likedUsers, error: likedError } = await supabase.from("merry_list").select("to_user_id").eq("from_user_id", user_id);

    if (likedError) {
      return res.status(500).json({ error: "Failed to fetch liked users", details: likedError.message });
    }

    // ถ้าไม่เคยกด like ใครเลย ก็ไม่มี matches
    if (!likedUsers || likedUsers.length === 0) {
      return res.status(200).json({ matches: [] });
    }

    // รวบรวม ID ของคนที่ถูก like
    const likedUserIds = likedUsers.map((item) => item.to_user_id);

    // 2. ดึงรายการคนที่กด like เรา (to_user_id <- from_user_id)
    const { data: likedByUsers, error: likedByError } = await supabase.from("merry_list").select("from_user_id").eq("to_user_id", user_id);

    if (likedByError) {
      return res.status(500).json({ error: "Failed to fetch users who liked you", details: likedByError.message });
    }

    // รวบรวม ID ของคนที่กด like เรา
    const likedByUserIds = likedByUsers.map((item) => item.from_user_id);

    // 3. หา Match = คนที่เรากด like และเขาก็กด like เรา
    const matchedUserIds = likedUserIds.filter((id) => likedByUserIds.includes(id));

    // ถ้าไม่มี matches
    if (matchedUserIds.length === 0) {
      return res.status(200).json({ matches: [] });
    }

    // 4. ดึงข้อมูลรายละเอียดของ matched users จากตาราง users
    const { data: matchedUsers, error: matchedUsersError } = await supabase
      .from("users")
      .select("id, name, profile_image_url")
      .in("id", matchedUserIds);

    if (matchedUsersError) {
      return res.status(500).json({ error: "Failed to fetch matched users details", details: matchedUsersError.message });
    }

    // 5. ส่งข้อมูลกลับไปยัง client
    return res.status(200).json({ matches: matchedUsers });
  } catch (error) {
    console.error("Error in match-list API:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
