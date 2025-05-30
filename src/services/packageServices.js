import { supabase } from "@/lib/supabaseClient";
export const getPackage= async() =>{
  try{
  const res = await fetch(`/api/package/all-package`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json()
  }catch(error){    
    console.error('Error fetching merried users:', error);
    throw error;} 
}

export const getPackageNow = async()=>{
  try{
    const {data} = await supabase.auth.getSession();
    const token = data.session?.access_token;
  const res = await fetch('/api/package/user-package', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
  return res.json()
  }catch(e){
        console.error('Error:', e);
    throw e;} 
}