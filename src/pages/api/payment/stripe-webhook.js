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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const userId = session.metadata.user_id;
      const plan = session.metadata.plan;
      const priceId = session.line_items?.[0]?.price?.id || null;
      const stripeSubscriptionId = session.subscription;

      // ดึงข้อมูล subscription จาก Stripe
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const status = subscription.status;
      const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      const canceledAt = subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null;

      // ✅ INSERT ลง stripe_subscriptions
      await supabase.from("stripe_subscriptions").insert({
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        plan,
        price_id: priceId,
        status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        canceled_at: canceledAt,
      });

      // ✅ ดึง package_id จาก package_name
      const { data: pkg, error: pkgError } = await supabase
        .from("packages")
        .select("id")
        .eq("package_name", plan)
        .single();

      if (pkgError || !pkg) {
        console.error("❌ Package not found:", plan);
        return res.status(400).send("Invalid plan");
      }

      // ✅ เช็กว่ามี user_packages อยู่แล้วไหม
      const { data: existing } = await supabase
        .from("user_packages")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const updatePayload = {
        package_id: pkg.id,
        status: "active",
        start_date: currentPeriodStart,
        end_date: currentPeriodEnd,
      };

      if (existing) {
        await supabase
          .from("user_packages")
          .update(updatePayload)
          .eq("user_id", userId);
      } else {
        await supabase.from("user_packages").insert({
          user_id: userId,
          ...updatePayload,
        });
      }

      console.log(`✅ Subscription created & synced for user ${userId}`);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const subId = subscription.id;

      // ✅ update stripe_subscriptions
      await supabase
        .from("stripe_subscriptions")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subId);

      // ✅ expire user package
      await supabase
        .from("user_packages")
        .update({ status: "expired" })
        .eq("user_id", subscription.metadata?.user_id);

      console.log(`⚠️ Subscription canceled: ${subId}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
