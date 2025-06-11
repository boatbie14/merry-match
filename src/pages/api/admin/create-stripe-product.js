import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price } = req.body;

  if (!name || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid name or price" });
  }

  try {
    // 1. Create Stripe product
    const product = await stripe.products.create({
      name,
    });

    // 2. Create Stripe price for monthly subscription
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // แปลง THB เป็นสตางค์
      currency: "thb",
      recurring: {
        interval: "month",
      },
    });

    return res.status(200).json({
      productId: product.id,
      priceId: stripePrice.id,
    });
  } catch (error) {
    console.error("Stripe product creation error:", error);
    return res.status(500).json({ error: "Failed to create Stripe product" });
  }
}
