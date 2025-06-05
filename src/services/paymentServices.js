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

export const getInfomationCreditCard = async (subscription_id) => {
  try {
    const res = await fetch("/api/payment/infomationCreditcard", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscription_id }),
    });
    return res.json();
  } catch (e) {
    console.error('Error fetching credit card information:', e);
    throw e;
  }
}

export async function redirectToStripePortal(subscription_id) {
      try {
      const res = await fetch('/api/payment/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Unable to create Stripe link');
      }
      } catch (err) {
      console.error(err);
      alert('An error occurred.');
      }
    }