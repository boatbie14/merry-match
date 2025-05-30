import { requireUser } from '@/middleware/requireUser';

export default async function handler(req, res) {
  if (req.method !== 'GET') 
    return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const result = await requireUser(req, res);
    if (!result) return result;
    const { supabase, userId } = result;

    const { data, error } = await supabase
      .rpc('get_user_matches', { target_user_id: userId });

    if (error) throw new Error(error.message);

    // กำหนดเวลาเริ่มต้นและสิ้นสุดของ "วันนี้" ตามเวลา UTC
    const now = new Date();

    const todayUTCStart = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));

    const tomorrowUTCStart = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));

    // กรอง matches ที่เกิดขึ้นในช่วงเวลาวันนี้ (UTC)
    const todayMatches = data
      .filter(entry => {
        const matchedAt = new Date(entry.matched_at);
        return matchedAt >= todayUTCStart && matchedAt < tomorrowUTCStart;
      })
      .map(entry => entry.match_user_id);

    // เอาทุก match user id ออกมาทั้งหมด
    const allMatches = data.map(entry => entry.match_user_id);
    console.log(data)
    console.log('All matches:', allMatches);
    console.log('Today matches (UTC):', todayMatches);

    return res.status(200).json({ allMatches, todayMatches });

  } catch (err) {
    console.error('merried-match error:', err);
    if (err.message === "Failed to fetch") {
      return res.status(500).json({ error: 'Failed to fetch married match' });
    } else if (err.message === "No rows found") {
      return res.status(404).json({ error: 'No married users match' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
