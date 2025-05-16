import { supabase } from '@/lib/supabaseClient';
  export async function addLikeCountLog(userId, count, dateString = null) {
    //TODO 🛑อย่างลืมเอาออก
    if (count === 9) {count = 2}
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

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { success: true, message: "Count updated" };
      
    } catch (error) {
      console.error("Error in addLikeCountLog:", error);
      return { success: false, error: error.message };
    }
  }
