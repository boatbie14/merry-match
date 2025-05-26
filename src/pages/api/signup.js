import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = "user-photos";

// ✅ ดึง path ของภาพจาก URL เต็ม
function extractImagePathFromURL(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname; // /storage/v1/object/public/user-photos/{userId}/filename.jpg
    const parts = path.split("/");

    const bucketIndex = parts.findIndex((p) => p === BUCKET_NAME);
    if (bucketIndex === -1) return null;

    return parts.slice(bucketIndex + 1).join("/"); // {userId}/filename.jpg
  } catch (err) {
    console.error("❌ Failed to extract image path:", url);
    return null;
  }
}

// ✅ ลบภาพจาก Storage จาก URL array
async function deleteUserImagesFromUrls(urls = []) {
  const imagePaths = urls
    .map((url) => extractImagePathFromURL(url))
    .filter(Boolean); // ตัด null ออก

  if (imagePaths.length === 0) return;

  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(imagePaths);

  if (deleteError) {
    console.error("⚠️ Failed to delete images:", deleteError.message);
  } else {
    console.log("🧹 Deleted images from storage");
  }
}

// ✅ ลบผู้ใช้จากระบบ auth
async function deleteAuthUser(userId) {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.error("❌ Failed to delete auth user:", error.message);
    } else {
      console.log("🗑️ Auth user deleted");
    }
  } catch (err) {
    console.error("❌ Exception while deleting auth user:", err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const {
      userId,
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
      console.error("🔥 Insert users error:", insertError);

      // 🔁 Rollback กรณี insert users ล้ม
      await deleteAuthUser(userId);
      await deleteUserImagesFromUrls([
        profile_image_url,
        image2_url,
        image3_url,
        image4_url,
        image5_url,
      ]);

      return res.status(400).json({ error: insertError.message });
    }

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
        console.error("🔥 Insert hobbies error:", hobbiesError.message);

        // 🔁 Rollback กรณี hobbies ล้ม
        await supabase.from("users").delete().eq("id", userId);
        await deleteAuthUser(userId);
        await deleteUserImagesFromUrls([
          profile_image_url,
          image2_url,
          image3_url,
          image4_url,
          image5_url,
        ]);

        return res.status(400).json({ error: hobbiesError.message });
      }
    }

    return res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error("🚨 Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
