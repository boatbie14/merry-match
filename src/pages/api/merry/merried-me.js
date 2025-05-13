import { dummyUser, requireUser } from '@/middleware/requireUser';
// ## TODO 🗝️🕐 change meddleware
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      
      if (!result) return result;
        
      // const { supabase, user } = result;
      const {supabase,userId} = result


      const { data, error } = await supabase
        .from('merry_list')
        .select('from_user_id, users:from_user_id (*)')
        .eq('to_user_id', 
          // user.id
          userId
        )
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      const merriedMe = data.map(entry => entry.users);
      return res.status(200).json(merriedMe);

    } catch (err) {
      console.error('Unexpected error:', err);

      if (err.message === "Failed to fetch") {
        return res.status(500).json({ error: 'Failed to fetch merried me' });
      } else if (err.message === "No rows found") {
        return res.status(404).json({ error: 'No merried-me found' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}