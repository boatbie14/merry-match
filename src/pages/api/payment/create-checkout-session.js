import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, plan } = req.body;

  if (!userId || !plan) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const priceMap = {
    basic: "price_1RR9rKCdJQNJsemAUZetM8xX",
    platinum: "price_1RR9wLCdJQNJsemAqbcFV8CU",
    premium: "price_1RR9xOCdJQNJsemA3Y83EtoX",
  };

  const priceId = priceMap[plan];
  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
    // 👉 สร้าง Checkout Session สำหรับ Subscription
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        user_id: userId,
        plan,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
