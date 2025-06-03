import { supabase } from "@/lib/supabaseClient";

export async function getMerryLike(from_user_id, to_user_id) {
  const { data, error } = await supabase
    .from("merry_list")
    .select("*")
    .eq("from_user_id", from_user_id)
    .eq("to_user_id", to_user_id)
    .single();

  return { data, error };
}

export async function deleteMerryLike(from_user_id, to_user_id) {
  const { data, error } = await supabase.from("merry_list").delete().eq("from_user_id", from_user_id).eq("to_user_id", to_user_id);

  return { data, error };
}

export async function insertMerryLike(from_user_id, to_user_id) {
  // 1. Insert ก่อน
  const { data, error } = await supabase.from("merry_list").insert([{ from_user_id, to_user_id }]);
  console.log(error);
  if (error) {
    return { data, error, checkMatchUser: false };
  }
  // Check Match
  const { data: mutualCheck, error: mutualError } = await supabase
    .from("merry_list")
    .select("*")
    .eq("from_user_id", to_user_id)
    .eq("to_user_id", from_user_id)
    .single();

  const checkMatchUser = mutualCheck ? true : false;
  if (checkMatchUser) {
    await updateChatRoomMatchStatus(from_user_id, to_user_id, true);
  }
  return {
    data,
    error: null,
    checkMatchUser,
  };
}

// ฟังก์ชันใหม่สำหรับจัดการ chat_rooms
export async function updateChatRoomMatchStatus(user1_id, user2_id, is_match) {
  try {
    const { data: chatRoom } = await supabase
      .from("chat_rooms")
      .select("id")
      .or(`and(user1_id.eq."${user1_id}",user2_id.eq."${user2_id}"),and(user1_id.eq."${user2_id}",user2_id.eq."${user1_id}")`)
      .maybeSingle();

    if (chatRoom) {
      const { data, error } = await supabase.from("chat_rooms").update({ is_match }).eq("id", chatRoom.id);

      return { data, error };
    }

    return { data: null, error: null }; // ไม่มี chat room ก็ไม่เป็นไร
  } catch (error) {
    console.error("Chat room update error:", error);
    return { data: null, error };
  }
}
