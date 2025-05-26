import { requireUser } from "@/middleware/requireUser";
import { getMerryLike, insertMerryLike } from "@/utils/query/merryLike";
import { addLikeCountLog } from "@/utils/query/addLikeCountLog";
import { checkMerryLimit } from "@/utils/query/checkMerryLimit";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const result = await requireUser(req, res);
    if (!result) return;
    const { userId } = result;
    const { toUserId, todayYMD, timezoneOffset } = req.body;

    if (userId === toUserId) {
      return res.status(200).json({ message: "You can not like yourself." });
    }

    // 1. ตรวจสอบว่ามี like นี้อยู่แล้วหรือไม่
    const { data: existingLike } = await getMerryLike(userId, toUserId);
    if (existingLike) {
      return res.status(200).json({ message: "Already liked" });
    }

    // 2. ดึงค่าจำนวน like วันนี้ และ limit แล้วก็ Check
    const { data } = await checkMerryLimit(userId, todayYMD, timezoneOffset);
    const { count, merry_per_day, log_date } = data;
    if (count <= 0) {
      return res.status(200).json({
        isLimitReached: true,
        message: "Like limit reached for today",
      });
    }

    // 3. เพิ่ม log การกด like วันนี้
    const logResult = await addLikeCountLog(userId, count, log_date);
    if (!logResult.success) {
      return res.status(500).json({ error: "Failed to log like count" });
    }

    // 4. เพิ่ม like ลงใน merry_list
    const { error, checkMatchUser } = await insertMerryLike(userId, toUserId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("Match User on Like.js === " + checkMatchUser);

    return res.status(200).json({ isLimitReached: false, message: "User liked successfully", checkMatchUser: checkMatchUser });
  } catch (e) {
    console.error("Error in handler:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
