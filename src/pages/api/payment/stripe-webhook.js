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
console.log("🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵🥵");
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

  // ✅ Handle subscription creation (after successful checkout)
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
        console.error(
          ":no_entry: Subscription missing start_date:",
          subscription
        );
        return res.status(500).send("Subscription missing start_date");
      }

      const invoices = await stripe.invoices.list({subscription: subscription.id,limit: 1});
      const latestInvoice = invoices.data[0];
      const invoicePdfUrl = latestInvoice?.invoice_pdf ?? null;

      const status = subscription.status;
      const currentPeriodStart = new Date(
        subscription.start_date * 1000
      ).toISOString();
      const currentPeriodEnd = new Date(
        subscription.start_date * 1000 + 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      const canceledAt = subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null;

      const { error: stripeErr } = await supabase
        .from("stripe_subscriptions")
        .insert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          plan,
          price_id: subscription.items?.data?.[0]?.price?.id ?? null,
          status,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          canceled_at: canceledAt,
        });

      if (stripeErr) {
        console.error("❌ Failed to insert stripe_subscriptions:", stripeErr);
      } else {
        console.log("➕ Inserted stripe_subscriptions");
      }

      const { data: pkg, error: pkgError } = await supabase
        .from("packages")
        .select("id, merry_per_day")
        .eq("package_name", plan)
        .single();

      if (pkgError || !pkg) {
        console.error("❌ Package not found:", plan);
        return res.status(400).send("Invalid plan");
      }

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
        const { error: insertErr } = await supabase
          .from("user_packages")
          .insert({
            user_id: userId,
            ...updatePayload,
          });
        if (insertErr) {
          console.error("❌ Failed to insert user_packages:", insertErr);
        } else {
          console.log("➕ Inserted user_packages");
        }
      }

      const today = new Date().toISOString().split("T")[0];

      await supabase
        .from("merry_count_log")
        .delete()
        .eq("user_id", userId)
        .eq("log_date", today);

      const { data: updatedPkgRow } = await supabase
        .from("user_packages")
        .select("id")
        .eq("user_id", userId)
        .single();

      const { error: insertLogErr } = await supabase
        .from("merry_count_log")
        .insert({
          user_id: userId,
          user_package_id: updatedPkgRow.id,
          log_date: today,
          count: pkg.merry_per_day,
        });

      if (insertLogErr) {
        console.error("❌ Failed to insert merry_count_log:", insertLogErr);
      } else {
        console.log("📊 Inserted merry_count_log");
      }

      console.log(`✅ Subscription synced for user ${userId}`);
    } catch (err) {
      console.error("🔥 Error processing subscription:", err);
      return res.status(500).send("Internal error processing subscription");
    }
  }

  // ✅ Handle expiration after unsubscribe (cancelation completed)
  else if (eventType === "customer.subscription.updated") {
    try {
      const subscription = event.data.object;
      const status = subscription.status;
      const stripeSubscriptionId = subscription.id;

      // fallback: try metadata first
      let userId = subscription.metadata?.user_id;

      // if metadata is missing, fallback to DB
      if (!userId) {
        const { data: subRecord, error: subErr } = await supabase
          .from("stripe_subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", stripeSubscriptionId)
          .single();

        if (subErr || !subRecord) {
          console.warn(
            "⚠️ Cannot find user_id from metadata or DB for subscription",
            stripeSubscriptionId
          );
          return res.status(200).json({ received: true });
        }

        userId = subRecord.user_id;
      }

      console.log("🔄 Subscription updated:", stripeSubscriptionId, status);

      if (status === "canceled" && !subscription.cancel_at_period_end) {
        const { error: updateErr } = await supabase
          .from("user_packages")
          .update({ package_status: "expired" })
          .eq("user_id", userId);

        if (updateErr) {
          console.error(
            "❌ Failed to mark user_packages as expired:",
            updateErr
          );
        } else {
          console.log("✅ Marked subscription as expired for user:", userId);
        }
      }
    } catch (err) {
      console.error("🔥 Error handling customer.subscription.updated:", err);
    }
  }

  return res.status(200).json({ received: true });
}
