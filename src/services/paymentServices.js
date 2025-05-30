import { supabase } from "@/lib/supabaseClient";


export const billingPDF = async (invoiceIds) => {
  try{
    const {data} = await supabase.auth.getSession();
const token = data.session?.access_token;
  const res = await fetch('/api/payment/history/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ invoiceIds }),
  });
  if(res.status!==200) {
    console.log(res.status)
    return res;}
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}catch(error){
  throw error
}
}

export const getHistoryPayment = async (limit = 20)=>{
  try{
    const {data} = await supabase.auth.getSession();
const token = data.session?.access_token;
  const res = await fetch(`/api/payment/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.json()
  }catch(error){    
    console.error('Error fetching merried users:', error);
    throw error;} 
}

export const cancelSubscription = async (subscription_id)=>{
  try{
  const res = await fetch("/api/payment/cancel-subscription",{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription_id }),
  });
  return res.json()
  }catch(error){    
    console.error('Error fetching merried users:', error);
    throw error;} 
}
