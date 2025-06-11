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

  // STEP 1: Fetch price_id from packages
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

  // STEP 2: Fetch existing Stripe customer or create one
  const { data: customerRow, error: customerErr } = await supabase
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  let customerId;

  if (customerErr || !customerRow?.stripe_customer_id) {
    console.log("🔨 No existing Stripe customer. Creating new one...");
    const customer = await stripe.customers.create({
      metadata: { user_id: userId },
    });

    customerId = customer.id;

    const { error: insertErr } = await supabase
      .from("stripe_customers")
      .insert({
        user_id: userId,
        stripe_customer_id: customerId,
      });

    if (insertErr) {
      console.error("❌ Failed to save Stripe customer to DB:", insertErr);
      return res.status(500).json({ error: "Failed to save Stripe customer" });
    }

    console.log("✅ Created and saved new Stripe customer:", customerId);
  } else {
    customerId = customerRow.stripe_customer_id;
    console.log("🔗 Found existing Stripe customer:", customerId);
  }

  // STEP 3: Cancel existing subscription at period end if exists
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

  // STEP 4: Create new Stripe Checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
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
    console.error("❌ Error creating Stripe session:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
