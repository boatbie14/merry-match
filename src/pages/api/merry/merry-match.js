import { requireUser } from '@/middleware/requireUser';

const today = new Date();
const todayUTCDate = new Date(Date.UTC(
  today.getUTCFullYear(),
  today.getUTCMonth(),
  today.getUTCDate()
));

const tomorrowUTCDate = new Date(Date.UTC(
  today.getUTCFullYear(),
  today.getUTCMonth(),
  today.getUTCDate() + 1
));

export default async function handler(req, res) {
  if (req.method !== 'GET')return res.status(405).json({ error: 'Method Not Allowed' });
  try {
      const result = await requireUser(req, res);
      if (!result) return result;
      const {supabase,userId} = result
        
      const { data, error } = await supabase
        .rpc('get_user_matches', { target_user_id: userId });
      if (error) {throw new Error(error.message);}

    const allMatches = data.map(entry => entry.match_user_id);  // ทุก match
    const todayMatches = data
  .filter(entry => {
    // matchedAt from Supabase is in UTC
    const matchedAt = new Date(entry.matched_at);
    return matchedAt >= todayUTCDate && matchedAt < tomorrowUTCDate;
  })
  .map(entry => entry.match_user_id);
    
    return res.status(200).json({allMatches,todayMatches})
    
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