import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { userId, lastActiveAt } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!lastActiveAt) {
      return res.status(400).json({
        success: false,
        message: "Last active timestamp is required",
      });
    }

    // Validate UUID format (ถ้า Supabase ใช้ UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Update last_active_at in users table
    const { data, error } = await supabase
      .from("users")
      .update({
        last_active_at: lastActiveAt,
      })
      .eq("id", userId)
      .select(); // เพื่อดูว่า update สำเร็จไหม

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({
        success: false,
        message: "Database update failed",
      });
    }

    // ตรวจสอบว่ามี record ที่ถูก update ไหม
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Last active updated successfully",
      data: {
        userId,
        lastActiveAt,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
