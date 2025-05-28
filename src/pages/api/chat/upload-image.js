// pages/api/chat/upload-image.js
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BUCKET_NAME = "user-photos";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    console.log("📤 Upload image request:", { userId, fileName: imageFile?.originalFilename });

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: "No image file provided",
      });
    }

    // เช็คประเภทไฟล์
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Only JPG, PNG, WebP are allowed",
      });
    }

    // เช็คขนาดไฟล์
    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum 5MB allowed",
      });
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const fileExtension = path.extname(imageFile.originalFilename || ".jpg");
    const fileName = `${timestamp}_image${fileExtension}`;
    const filePath = `chat-images/${userId}/${fileName}`;

    // อ่านไฟล์
    const fileBuffer = fs.readFileSync(imageFile.filepath);

    // อัพโหลดไป Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileBuffer, {
      contentType: imageFile.mimetype,
      cacheControl: "3600",
    });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload image",
        details: uploadError.message,
      });
    }

    // สร้าง public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    console.log("✅ Image uploaded successfully:", imageUrl);

    // ลบไฟล์ temporary
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (cleanupError) {
      console.warn("⚠️ Failed to cleanup temp file:", cleanupError.message);
    }

    res.status(200).json({
      success: true,
      imageUrl,
      fileName,
      fileSize: imageFile.size,
    });
  } catch (error) {
    console.error("💥 Upload image error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
}
