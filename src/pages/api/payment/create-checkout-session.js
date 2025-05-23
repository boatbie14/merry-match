import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, plan } = req.body;

  console.log("📩 Received body:", { userId, plan });

  if (!userId || !plan) {
    console.warn("⛔ Missing userId or plan");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const priceMap = {
    basic: "price_1RR9rKCdJQNJsemAUZetM8xX",
    platinum: "price_1RR9wLCdJQNJsemAqbcFV8CU",
    premium: "price_1RR9xOCdJQNJsemA3Y83EtoX",
  };

  const priceId = priceMap[plan];
  console.log("💰 Mapped priceId:", priceId);

  if (!priceId) {
    console.warn("⛔ Invalid plan selected:", plan);
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
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

    console.log("✅ Created Stripe session:", session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
