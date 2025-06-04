import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription_id } = req.body;

  try {
    // ดึง subscription
    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    // ดึง paymentMethodId จาก subscription ก่อน
    let paymentMethodId = subscription.default_payment_method;

    // ถ้า subscription ไม่มี default_payment_method ให้ fallback ไปดึงจาก customer
    if (!paymentMethodId) {
      const customer = await stripe.customers.retrieve(subscription.customer);
      paymentMethodId = customer.invoice_settings.default_payment_method;

      // ⛳️ บังคับให้ subscription ผูกกับบัตรนี้ไปเลย
      if (paymentMethodId) {
        await stripe.subscriptions.update(subscription_id, {
          default_payment_method: paymentMethodId,
        });
      }
    }

    // ถ้ายังไม่เจออีก
    if (!paymentMethodId) {
      return res.status(404).json({ error: 'No default payment method found.' });
    }

    // ดึงข้อมูลบัตร
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (paymentMethod.type !== 'card') {
      return res.status(400).json({ error: 'Payment method is not a card.' });
    }

    const card = paymentMethod.card;

    res.status(200).json({
      brand: card.brand,
      last4: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
    });

  } catch (error) {
    console.log('Error retrieving payment method:', error);
    res.status(500).json({ error: error.message });
  }
}
