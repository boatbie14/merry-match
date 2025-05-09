import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    console.log("📥 Supabase createUser response:", data);
    console.log("📛 Supabase createUser error:", error);
    if (!data?.user?.id) {
      return res.status(500).json({ error: "Missing userId from Supabase response" });
    }

    return res.status(200).json({ userId: data.user.id });
  } catch (err) {
    console.error("❌ pre-signup error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
