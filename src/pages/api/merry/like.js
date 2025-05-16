import { requireUser } from '@/middleware/requireUser';
import { getMerryLike, insertMerryLike} from '@/lib/query/merryLike';
import { addLikeCountLog } from '@/lib/query/addLikeCountLog';
import { checkMerryLimit } from '@/lib/query/checkMerryLimit';
// TODO 🩵 ตรวจสอบความถูกต้อง และ เช็คฟังก์ชันพี่โบทส
// TODO 💙โลจิกการ แจ้งให้ client รู้ว่า limit เกิน
export default async function handler(req, res) {
  if (req.method !== 'POST') {return res.status(405).json({ error: 'Method Not Allowed' });}
  try {
    const result = await requireUser(req, res);
    if (!result) return;
    const { userId } = result;
    const { toUserId,dateString } = req.body;

    // 1. ตรวจสอบว่ามี like นี้อยู่แล้วหรือไม่
    const { data: existingLike} = await getMerryLike(userId, toUserId);
    if (existingLike) {return res.status(200).json({ message: 'Already liked' });}

    // 2. ดึงค่าจำนวน like วันนี้ และ limit
    const {data} = await checkMerryLimit(userId, dateString);
    const {count,merry_per_day,log_date} = data
    if (count >= merry_per_day) {return res.status(403).json({ message: 'Like limit reached for today' });}

    // 3. เพิ่ม log การกด like วันนี้
    const logResult = await addLikeCountLog(userId,count,log_date);
    if (!logResult.success) {return res.status(500).json({ error: 'Failed to log like count' });}

    // 4. เพิ่ม like ลงใน merry_list
    const { error } = await insertMerryLike(userId, toUserId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'User liked successfully' });
  } catch (e) {
    console.error('Error in handler:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}