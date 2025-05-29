import { supabase } from "@/lib/supabaseClient";

export async function bufferNotificationMerry(from_user_id, to_user_id) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
const { data, error } = await supabase
  .from('notifications')
  .select('created_at')
  .eq('from_user_id', from_user_id)
  .eq('to_user_id', to_user_id)
  .in('noti_type', ['merry', 'match']) // ✅ เปลี่ยนตรงนี้
  .gte('created_at', thirtyMinutesAgo)
  .order('created_at', { ascending: false })
  .limit(1);
  if (error) {
    console.error('Supabase error:', error.message);
    return false; // ไม่ควรสร้างถ้ามีปัญหาเชื่อมต่อ
  }
  if (data && data.length > 0) {
    return false;
  }
  return true;
}


export async function bufferNotificationMerry(from_user_id, to_user_id) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("notifications")
    .select("created_at")
    .eq("from_user_id", from_user_id)
    .eq("to_user_id", to_user_id)
    .in("noti_type", ["merry", "match"]) // ✅ เปลี่ยนตรงนี้
    .gte("created_at", thirtyMinutesAgo)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    console.error("Supabase error:", error.message);
    return false; // ไม่ควรสร้างถ้ามีปัญหาเชื่อมต่อ
  }
  if (data && data.length > 0) {
    return false;
  }
  return true;
}

export async function addNotifications_Log(type, from_user_id, to_user_id, match = false, firstMessage = false) {
  try {
    //Get From user data
    const { data: fromUser, error: userError } = await supabase
      .from("users")
      .select("name, profile_image_url")
      .eq("id", from_user_id)
      .single();

    if (userError) {
      console.error("❌ Error fetching user data:", userError);
    }

    const fromUserName = fromUser?.name || from_user_id; //name
    const fromUserImage = fromUser?.profile_image_url || null; //profile image

    switch (type) {
      case "merry": {
        console.log("------------------------------------------------");
        const buffer = await bufferNotificationMerry(from_user_id, to_user_id);
        console.log("232341234143414");
        if (!buffer) {
          break;
        }
        let insertType = "";
        if (match) {
          insertType = "match";
        } else {
          const { data: matchData, error: matchError } = await supabase
            .from("merry_list")
            .select("id")
            .eq("from_user_id", to_user_id)
            .eq("to_user_id", from_user_id)
            .single();
          if (matchError && matchError.code !== "PGRST116") {
            throw matchError;
          }
          insertType = matchData ? "match" : "merry";
        }

        const message =
          insertType === "match"
            ? `‘${fromUserName}’ Merry you back! Let’s start conversation now`
            : `‘${fromUserName}’ Just Merry you! Click here to see profile`;

        const { error: insertError } = await supabase.from("notifications").insert({
          from_user_id,
          to_user_id,
          noti_type: insertType,
          created_at: new Date().toISOString(),
          is_read: false,
          message: message,
        });
        if (insertError) throw insertError;
        break;
      }

    case 'message': {
          let insertType = ""
          if(firstMessage){ insertType = "first time"} 
          else{
            const { data: messagesData, error: messagesError } = await supabase.from('messages')
              .select('id')
              .eq('sender_id', from_user_id)
              .eq('receiver_id', to_user_id)
              .single();
            if (messagesError && messagesError.code !== 'PGRST116') {
              throw matchError;
            }
            insertType = messagesData ? 'first time' : 'Not the first time';
          }
            const message = insertType === 'first time'
                                          ?`‘${from_user_id}’ ---`
                                          :`‘${from_user_id}’ ===`;
      
            const { error: msgError } = await supabase.from('notifications').insert({
              from_user_id,
              to_user_id,
              noti_type: insertType,
              created_at: new Date(),
              is_read: true,
              message: message,
            });
            if (msgError) throw msgError;
              break;
            }

      default:
        throw new Error(`Invalid type: ${type}`);
    }
  } catch (err) {
    console.error("recordAction error:", err);
    await supabase.from("error_logs").insert({
      function: "recordAction",
      input: { type, from_user_id, to_user_id },
      error_message: String(err),
      location: "addNotifications_Log",
    });
  }
}
