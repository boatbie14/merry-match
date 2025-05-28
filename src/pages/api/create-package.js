import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { package_name, merry_per_day, details, iconUrl } = req.body;

    if (!package_name || !iconUrl || merry_per_day === undefined || merry_per_day === null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { error } = await supabase.from("packages").insert([
      {
        package_name,
        merry_per_day: Number(merry_per_day),
        details: details || [],
        icon_url: iconUrl,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ message: "Insert failed", error });
    }

    return res.status(201).json({ message: "Package created successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Unexpected error", error: err.message });
  }
}
