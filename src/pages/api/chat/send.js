// pages/api/chat/send.js
import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // รับข้อมูลจาก request body
    const { sender_id, receiver_id, content, username } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // กำหนดค่า username เป็น "Boat" หากไม่มีค่าส่งมา
    const usernameToUse = username || "Boat";
    
    // ดึง IP address ของผู้ใช้
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";

    // แสดงข้อมูลที่จะบันทึกเพื่อตรวจสอบ
    console.log("Data to insert:", {
      sender_id,
      receiver_id,
      content,
      sender_ip: ip,
      chat_status: "sent",
      username: usernameToUse
    });

    // บันทึกข้อความลงฐานข้อมูล
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id,
        receiver_id,
        content,
        sender_ip: ip,
        chat_status: "sent",
        username: usernameToUse  // ใช้ค่าที่กำหนดไว้แล้ว
      })
      .select();

    // ตรวจสอบข้อผิดพลาด
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    // ส่งข้อมูลกลับไปยัง client
    return res.status(200).json({ 
      success: true, 
      message: data[0] 
    });
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}