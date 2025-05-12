import { dummyUser, requireUser } from '@/middleware/requireUser';
// ## TODO 🗝️🕐 change meddleware
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      
      if (!result) return result;

    //   const { supabase, user } = result;
      const {supabase,userId} = result
        
    const { data, error } = await supabase
      .rpc('get_user_matches', { target_user_id: userId });

    if (error) {
      throw new Error(error.message);
    }

    const allMatches = data.map(entry => entry.match_user_id);  // ทุก match
    const todayMatches = data.filter(entry => {
      const today = new Date();
      const matchDate = new Date(entry.matched_at);
      return matchDate.toDateString() === today.toDateString();
    }).map(entry => entry.match_user_id); // ถ้า match กับวันนี้
    return res.status(200).json({allMatches,todayMatches})
  } catch (error) {
    console.error('Error getting matches:', error);
    throw new Error('Failed to get matches');
  }
}
}