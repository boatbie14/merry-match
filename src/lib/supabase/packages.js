import { supabase } from "@/utils/supabase/component";

export async function getPackageById(id) {
  const { data, error } = await supabase.from("packages").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function updatePackage(id, payload) {
  const { data, error } = await supabase.from("packages").update(payload).eq("id", id).single();
  if (error) throw error;
  return data;
}
