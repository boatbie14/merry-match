const extractStoragePath = (url) => {
  const baseUrl = "https://dlvptnewdgewaptlqbsa.supabase.co/storage/v1/object/public/user-photos/";
  return url.startsWith(baseUrl) ? url.replace(baseUrl, "") : null;
};

export const prepareDeleteImages = (newImages, oldData) => {
    // 1. เอา src ของรูปใหม่ (ที่ไม่ใช่ค่าว่าง)
    const newUrls = newImages.map((img) => img.src).filter(Boolean);
    // 2. เอา url เก่าจาก data (field image1–5)
    const oldUrls = [
      oldData.profile_image_url,
      oldData.image2_url,
      oldData.image3_url,
      oldData.image4_url,
      oldData.image5_url,
    ].filter(Boolean);
    // 3. หา URL ที่ควรถูกลบ
    const urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));
    // 4. แปลง URL เป็น path ใน storage
    const filesToDelete = urlsToDelete
      .map((url) => extractStoragePath(url))
      .filter(Boolean);
    return filesToDelete
    
};