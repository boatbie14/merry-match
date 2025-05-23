import { buffer } from "micro";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  console.log("🔥 Stripe webhook เรียกแล้ว");

  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventType = event.type;
  console.log(`📩 Received event: ${eventType}`);

  if (eventType === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;
    const sessionId = session.id;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });
      const subscription = fullSession.subscription;

      if (!subscription?.start_date) {
        console.error("⛔ Subscription missing start_date:", subscription);
        return res.status(500).send("Subscription missing start_date");
      }

      const status = subscription.status;
      const currentPeriodStart = new Date(subscription.start_date * 1000).toISOString();
      const currentPeriodEnd = new Date(subscription.start_date * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString();
      const canceledAt = subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null;

      // 👉 INSERT ลง stripe_subscriptions
      await supabase.from("stripe_subscriptions").insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        plan,
        price_id: subscription.items?.data?.[0]?.price?.id ?? null,
        status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        canceled_at: canceledAt,
      });

      // 👉 ดึง package_id จาก table packages
      const { data: pkg, error: pkgError } = await supabase
        .from("packages")
        .select("id")
        .eq("package_name", plan)
        .single();

      if (pkgError || !pkg) {
        console.error("❌ Package not found:", plan);
        return res.status(400).send("Invalid plan");
      }

      // 👉 เช็กว่า user มี record เดิมไหม
      const { data: existing } = await supabase
        .from("user_packages")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const updatePayload = {
        package_id: pkg.id,
        package_status: "active",
        start_date: currentPeriodStart,
        end_date: currentPeriodEnd,
      };

      if (existing) {
        const { error: updateErr } = await supabase
          .from("user_packages")
          .update(updatePayload)
          .eq("user_id", userId);
        if (updateErr) {
          console.error("❌ Failed to update user_packages:", updateErr);
        } else {
          console.log("📝 Updated user_packages");
        }
      } else {
        const { error: insertErr } = await supabase.from("user_packages").insert({
          user_id: userId,
          ...updatePayload,
        });
        if (insertErr) {
          console.error("❌ Failed to insert user_packages:", insertErr);
        } else {
          console.log("➕ Inserted user_packages");
        }
      }

      console.log(`✅ Subscription synced for user ${userId}`);
    } catch (err) {
      console.error("🔥 Error processing subscription:", err);
      return res.status(500).send("Internal error processing subscription");
    }
  }

  res.status(200).json({ received: true });
}
