import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload images to Supabase Storage and return public URLs
 * @param {Array} images - Array of 5 items: { id, file }
 * @param {String} userId - Supabase user id (UUID)
 * @returns {Object} - { profile_image_url, image2_url, ..., image5_url }
 */
export async function uploadImagesToSupabase(images, userId) {
  const urls = {
    profile_image_url: null,
    image2_url: null,
    image3_url: null,
    image4_url: null,
    image5_url: null,
  };

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (!image?.file) continue;

    const fileExt = image.file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `users/${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("user-photos")
      .upload(filePath, image.file);

    if (error) {
      console.error(`❌ Upload failed for ${filePath}:`, error.message);
      continue;
    }

    const { data } = supabase.storage
      .from("user-photos")
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      switch (i) {
        case 0:
          urls.profile_image_url = data.publicUrl;
          break;
        case 1:
          urls.image2_url = data.publicUrl;
          break;
        case 2:
          urls.image3_url = data.publicUrl;
          break;
        case 3:
          urls.image4_url = data.publicUrl;
          break;
        case 4:
          urls.image5_url = data.publicUrl;
          break;
      }
    }
  }

  return urls;
}
