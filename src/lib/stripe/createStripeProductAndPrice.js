import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function createStripeProductAndPrice({ name, price }) {
  const product = await stripe.products.create({
    name,
  });

  const priceObj = await stripe.prices.create({
    unit_amount: price * 100, 
    currency: 'thb',
    product: product.id,
  });

  return {
    productId: product.id,
    priceId: priceObj.id,
  };
}
