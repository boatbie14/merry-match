import { requireUser } from "@/middleware/requireUser.js";

export default async function handler(req, res) {
 if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const result = await requireUser(req, res);
    if (!result) return;
    const { userId,supabase } = result;
    const { data: userPackage, error: userPackageError } = await supabase
  .from('users')
  .select(`
    user_packages (
      package_status,
      packages:package_id (
        package_name,
        price,
        icon_url,
        details
      )
    ),
    stripe_subscriptions (
      stripe_subscription_id,
      canceled_at,
      current_period_end,
      current_period_start,
      created_at
    )
  `)
  .eq('id', userId)
  .order('created_at', { foreignTable: 'stripe_subscriptions', ascending: false })
  .limit(1, { foreignTable: 'stripe_subscriptions' });

    if (userPackageError || !userPackage) {
      return res.status(404).json({ error: "User package not found",userPackageError });
    }
    return res.status(200).json( userPackage );
  } catch (e) {
    console.error("Error in handler:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
