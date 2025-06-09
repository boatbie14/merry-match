import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

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

  // STEP 1: ดึง price_id จากแพ็กเกจ
  const { data: priceRow, error: priceErr } = await supabase
    .from("packages")
    .select("price_id")
    .eq("package_name", plan)
    .single();

  if (priceErr || !priceRow?.price_id) {
    console.warn("⛔ Invalid plan or missing price_id:", priceErr);
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  const priceId = priceRow.price_id;
  console.log("💰 Loaded priceId from DB:", priceId);

  // STEP 2: ดึง stripe_customer_id จากตาราง stripe_customers
  const { data: customerRow, error: customerErr } = await supabase
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (customerErr || !customerRow?.stripe_customer_id) {
    console.warn("⛔ Missing stripe_customer_id:", customerErr);
    return res.status(400).json({ error: "User not connected with Stripe" });
  }

  const customerId = customerRow.stripe_customer_id;

  // STEP 3: ตรวจสอบ subscription เดิม และตั้งให้ยกเลิกตอนจบรอบ
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  const activeSub = subscriptions.data[0];
  if (activeSub) {
    console.log("🔁 Found existing subscription. Scheduling cancel:", activeSub.id);
    await stripe.subscriptions.update(activeSub.id, {
      cancel_at_period_end: true,
    });
  }

  // STEP 4: สร้าง checkout session ใหม่
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId, // ใช้ customer เดิม
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${req.headers.origin}/payment/cancel?package=${plan}`,
      metadata: {
        user_id: userId,
        plan,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan,
        },
      },
    });

    console.log("✅ Created Stripe session:", session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
