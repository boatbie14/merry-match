import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscription_id } = req.body;
  if (!subscription_id) {
    return res.status(400).json({ error: 'Missing subscription_id' });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscription_id);
    const customerId = subscription.customer;

    if (!customerId) {
      return res.status(404).json({ error: 'Customer not found for this subscription' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://billing.stripe.com/p/login/test_9B67sK44T7pia3M6jd00000',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
}