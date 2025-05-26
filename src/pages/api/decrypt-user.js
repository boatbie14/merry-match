// pages/api/decrypt-user.js
import { decryptUserId, isValidEncryptedId } from "../../utils/crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { encryptedId } = req.body;

    if (!encryptedId) {
      return res.status(400).json({ message: "Encrypted ID is required" });
    }

    // ตรวจสอบความถูกต้องก่อน
    if (!isValidEncryptedId(encryptedId)) {
      return res.status(400).json({ message: "Invalid encrypted ID" });
    }

    // Decrypt user ID
    const userId = decryptUserId(encryptedId);

    if (!userId) {
      return res.status(400).json({ message: "Failed to decrypt user ID" });
    }

    console.log("Successfully decrypted user ID:", userId);

    // อาจจะเรียก API เพื่อดึงข้อมูล user profile ด้วย
    // const userProfile = await fetchUserProfile(userId);

    res.status(200).json({
      userId,
      success: true,
      // userProfile (ถ้ามี)
    });
  } catch (error) {
    console.error("Decrypt API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
