// merry_list
import { supabase } from '@/lib/supabaseClient';

export async function getMerryLike(from_user_id, to_user_id) {
  const { data, error } = await supabase
    .from('merry_list')
    .select('*')
    .eq('from_user_id', from_user_id)
    .eq('to_user_id', to_user_id)
    .single();

    return {data,error};
}

export async function deleteMerryLike(from_user_id, to_user_id) {
  const { data, error } = await supabase
    .from('merry_list')
    .delete()
    .eq('from_user_id', from_user_id)
    .eq('to_user_id', to_user_id);
  
  return {data,error};
}

export async function insertMerryLike(from_user_id, to_user_id) {
  const { data, error } = await supabase
    .from('merry_list')
    .insert([{ from_user_id, to_user_id }]);
  return {data,error};
}

