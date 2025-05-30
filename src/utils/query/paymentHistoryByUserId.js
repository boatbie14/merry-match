 import { supabase } from '@/lib/supabaseClient';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getPaymentsByUserId = async (userId, limitValue) => {
  // 1. ดึงข้อมูล subscription จาก Supabase
  const { data: subscriptions, error } = await supabase
    .from('stripe_subscriptions')
    .select('stripe_subscription_id, plan, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limitValue);

  if (error) {
    throw new Error(error.message);
  }

  const results = [];

  // 2. loop ผ่านแต่ละ subscription แล้วไปดึง invoices จาก Stripe
  for (const sub of subscriptions) {
    const invoices = await stripe.invoices.list({
      subscription: sub.stripe_subscription_id,
      limit: 1, // ดึงแค่ invoice ล่าสุด (หากต้องการทั้งหมด ให้ลบออก)
    });

    const latestInvoice = invoices.data[0];

    results.push({
      subscription_id: sub.stripe_subscription_id,
      plan: sub.plan,
      created_at: sub.created_at,
      amount_paid: latestInvoice?.amount_paid / 100 || 0, // แปลงจาก cents เป็นบาท/ดอลลาร์
      invoice_pdf: latestInvoice?.invoice_pdf || null,
    });
  }
  return results;
};
