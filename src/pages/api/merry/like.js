<<<<<<< HEAD
import { requireUser } from '@/middleware/requireUser';
import { getMerryLike, insertMerryLike} from '@/utils/query/merryLike';
import { addLikeCountLog } from '@/utils/query/addLikeCountLog';
import { checkMerryLimit } from '@/utils/query/checkMerryLimit';
// TODO 🔳💙โลจิกการ แจ้งให้ client รู้ว่า limit เกิน คือ 403 ทำแล้วแต่ยังไม่เช็ค
=======
import { requireUser } from "@/middleware/requireUser";
import { getMerryLike, insertMerryLike } from "@/lib/query/merryLike";
import { addLikeCountLog } from "@/lib/query/addLikeCountLog";
import { checkMerryLimit } from "@/lib/query/checkMerryLimit";
// TODO 🩵 ตรวจสอบความถูกต้อง และ เช็คฟังก์ชันพี่โบทส
// TODO 💙โลจิกการ แจ้งให้ client รู้ว่า limit เกิน
>>>>>>> bb5df64 (feature(matching): update Merry logic and improve mobile responsive)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const result = await requireUser(req, res);
    if (!result) return;
    const { userId } = result;
    const { toUserId, dateString, timezone } = req.body;

    if(userId === toUserId){return res.status(200).json({ message: 'You can not like yourself.' });}

    // 1. ตรวจสอบว่ามี like นี้อยู่แล้วหรือไม่
    const { data: existingLike } = await getMerryLike(userId, toUserId);
    if (existingLike) {
      return res.status(200).json({ message: "Already liked" });
    }

<<<<<<< HEAD
    // 2. ดึงค่าจำนวน like วันนี้ และ limit
    const {data} = await checkMerryLimit(userId, dateString);
    const {count,merry_per_day,log_date} = data
    if (count >= merry_per_day) {return res.status(403).json({ message: 'Like limit reached for today' });} // เช็คที่ 403 ✅
=======
    // 2. ดึงค่าจำนวน like วันนี้ และ limit แล้วก็ Check
    const { data } = await checkMerryLimit(userId, dateString, timezone);
    const { count, merry_per_day, log_date } = data;
    if (count >= merry_per_day) {
      return res.status(200).json({
        isLimitReached: true,
        message: "Like limit reached for today",
      });
    }
>>>>>>> bb5df64 (feature(matching): update Merry logic and improve mobile responsive)

    // 3. เพิ่ม log การกด like วันนี้
    const logResult = await addLikeCountLog(userId, count, log_date, timezone);
    if (!logResult.success) {
      return res.status(500).json({ error: "Failed to log like count" });
    }

    // 4. เพิ่ม like ลงใน merry_list
    const { error } = await insertMerryLike(userId, toUserId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ isLimitReached: false, message: "User liked successfully" });
  } catch (e) {
    console.error("Error in handler:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
