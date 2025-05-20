<<<<<<< HEAD:src/utils/query/addLikeCountLog.js
import { supabase } from '@/lib/supabaseClient';
  export async function addLikeCountLog(userId, count, dateString = null) {
    try {
      let clientDate;
      let todayYMD;
      if (dateString) {
        clientDate = new Date(dateString);
        todayYMD = clientDate.toISOString().split("T")[0]+ " 00:00:00+00";;
      } else {
        clientDate = new Date();
        clientDate.setHours(clientDate.getHours() + 7);
        todayYMD = clientDate.toISOString().split("T")[0]+ " 00:00:00+00";;
      }
      const { error: updateError } = await supabase
        .from("merry_count_log")
        .update({ count:count+1})
        .eq("user_id", userId)
        .eq("log_date", todayYMD)
        .select();
=======
import { supabase } from "@/lib/supabaseClient";
>>>>>>> bb5df64 (feature(matching): update Merry logic and improve mobile responsive):src/lib/query/addLikeCountLog.js

//######## Replace
export async function addLikeCountLog(userId, count, log_date) {
  try {
    console.log("Current count before update:", count); // Log เพื่อดูค่า count ก่อนอัพเดท

    // ดึงข้อมูล merry_count_log ล่าสุดของ user นี้
    const { data: latestLog, error: fetchError } = await supabase
      .from("merry_count_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const currentCount = latestLog.count;

    // อัพเดท count สำหรับ record ล่าสุดของวันนี้
    const { data: updatedLog, error: updateError } = await supabase
      .from("merry_count_log")
      .update({ count: currentCount + 1 }) // ใช้ค่าจาก DB + 1
      .eq("id", latestLog.id)
      .select();

    if (updateError) {
      throw new Error(updateError.message);
    }

    console.log("Updated log:", updatedLog);

    return { success: true, message: "Count updated", count: currentCount + 1 };
  } catch (error) {
    console.error("Error in addLikeCountLog:", error);
    return { success: false, error: error.message };
  }
}
