import { requireUser } from '@/middleware/requireUser';
import { createClient } from '@supabase/supabase-js'

//TODO 🔛 use service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
export default async function handler(req, res) {
  if (req.method !== 'PUT') {return res.status(405).json({ error: 'Method not allowed' });}
   try {
      const result = await requireUser(req, res);
      if (!result) return result;
      const {supabase,userId} = result
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { profileData,deletedImages} = body;

      const {
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
        bio = [],
        profile_image_url,
        image2_url,
        image3_url,
        image4_url,
        image5_url,
        } = profileData;

      const userUpdatePayload = {
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
        bio,
        profile_image_url,
        image2_url,
        image3_url,
        image4_url,
        image5_url,
        };  

    const { error: updateError } = await supabase
      .from("users")
      .update(userUpdatePayload)
      .eq("id", userId);

    if (updateError) {
      console.error("🔥 Update users error:", updateError);
      return res.status(400).json({ error: updateError.message });
    }
    if (deletedImages.length > 0) {
        const { error } = await supabaseAdmin.storage
                  .from("user-photos")
                  .remove(deletedImages);
        if (error) {
            console.error("Error deleting old images:", error);
            return res.status(400).json({ error: error });
        }}

    if (Array.isArray(hobbies)) {
      await supabase.from("hobbies").delete().eq("user_id", userId); 
      if (hobbies.length > 0) {
        const hobbiesToInsert = hobbies.map((hobby) => ({
          user_id: userId,
          hobbie_name: hobby,
        }));
        const { error: hobbiesError } = await supabase
          .from("hobbies")
          .insert(hobbiesToInsert);
        if (hobbiesError) {
          return res.status(400).json({ error: hobbiesError.message });
        }
      }
    }
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Internal error:", err);  
    return res.status(500).json({ error: "Internal server error" });
  }

}

