// /pages/api/payment/cancel-subscription.js
import { supabase } from '@/lib/supabaseClient'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { subscription_id } = req.body
  try {
    // 1. Cancel at period end (NOT immediately)
    const updatedSubscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: true,
    })   
    if (updatedSubscription.cancel_at_period_end !== true) {
    return res.status(500).json({ error: 'Failed to set cancel_at_period_end' })
    }
const { error } = await supabase
  .from('stripe_subscriptions')
  .update({ canceled_at: new Date().toISOString() })
  .eq('stripe_subscription_id', subscription_id)

if (error) throw error
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Cancel error:', err)
    return res.status(500).json({ error: 'Failed to cancel subscription' })
  }
}
