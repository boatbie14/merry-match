// utils/crypto.js
import CryptoJS from "crypto-js";

// ใช้ secret key จาก environment variable
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPT_KEY || "fallback-secret-key";

/**
 * เข้ารหัส User ID
 * @param {string|number} userId - ID ของผู้ใช้
 * @returns {string|null} - Encrypted string หรือ null ถ้าผิดพลาด
 */
export const encryptUserId = (userId) => {
  try {
    if (!userId) {
      console.error("encryptUserId: userId is required");
      return null;
    }

    console.log("Encrypting userId:", userId);
    const encrypted = CryptoJS.AES.encrypt(userId.toString(), SECRET_KEY).toString();
    const urlSafe = encodeURIComponent(encrypted);
    console.log("Encrypted successfully:", urlSafe);
    return urlSafe;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

/**
 * ถอดรหัส User ID
 * @param {string} encryptedId - Encrypted string
 * @returns {string|null} - User ID หรือ null ถ้าผิดพลาด
 */
export const decryptUserId = (encryptedId) => {
  try {
    if (!encryptedId) {
      console.error("decryptUserId: encryptedId is required");
      return null;
    }

    console.log("Decrypting encryptedId:", encryptedId);
    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
    const result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result) {
      console.error("decryptUserId: Failed to decrypt or invalid data");
      return null;
    }

    console.log("Decrypted successfully:", result);
    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

/**
 * ตรวจสอบว่า encrypted string ถูกต้องหรือไม่
 * @param {string} encryptedId - Encrypted string
 * @returns {boolean} - true ถ้าถูกต้อง
 */
export const isValidEncryptedId = (encryptedId) => {
  const decrypted = decryptUserId(encryptedId);
  return decrypted !== null && decrypted !== "";
};
