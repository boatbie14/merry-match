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
      return null;
    }

    const encrypted = CryptoJS.AES.encrypt(userId.toString(), SECRET_KEY).toString();
    const urlSafe = encodeURIComponent(encrypted);
    return urlSafe;
  } catch (error) {
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
      return null;
    }

    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
    const result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result) {
      return null;
    }

    return result;
  } catch (error) {
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
