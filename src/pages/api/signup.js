import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const {
      userId, // 👈 รับมาจาก pre-signup
      name,
      username,
      email,
      location,
      city,
      date_of_birth,
      sexual_identity,
      sexual_preference,
      racial_preference,
      meeting_interest,
      hobbies = [],
      profile_image_url,
      image2_url,
      image3_url,
      image4_url,
      image5_url,
    } = body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId from pre-signup" });
    }


    // 1. Insert profile data
    const userPayload = {
      id: userId,
      name,
      username,
      email,
      location,
      city,
      date_of_birth,
      sexual_identity,
      sexual_preference,
      racial_preference,
      meeting_interest,
      profile_image_url,
      image2_url,
      image3_url,
      image4_url,
      image5_url,
    };

    console.log("🧾 Inserting to users:", userPayload);

    const { error: insertError } = await supabase
      .from("users")
      .insert(userPayload);
    if (insertError) {
      console.error("🔥 Insert users error:", insertError); // เพิ่มบรรทัดนี้
      return res.status(400).json({ error: insertError.message });
    }

    // 2. Insert hobbies
    if (Array.isArray(hobbies) && hobbies.length > 0) {
      const hobbiesToInsert = hobbies.map((hobby) => ({
        user_id: userId,
        hobbie_name: hobby,
      }));
      console.log("🎯 Inserting hobbies:", hobbiesToInsert);

      const { error: hobbiesError } = await supabase
        .from("hobbies")
        .insert(hobbiesToInsert);

      if (hobbiesError) {
        await supabase.from("users").delete().eq("id", userId);
        return res.status(400).json({ error: hobbiesError.message });
      }
    }

    return res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Internal error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
