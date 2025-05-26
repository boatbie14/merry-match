// pages/api/chat/get-messages.js
import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // รับข้อมูลจาก request body
    const { sender_id, receiver_id } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: "Missing sender_id or receiver_id" });
    }

    // ดึงข้อความระหว่างผู้ใช้สองคน
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
      .order("created_at", { ascending: true });

    // ตรวจสอบข้อผิดพลาด
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    // ส่งข้อมูลกลับไปยัง client
    return res.status(200).json({
      success: true,
      messages: data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
