import { dummyUser, requireUser } from '@/middleware/requireUser';
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
        .select('to_user_id, users:to_user_id (*)')
        .eq('from_user_id', 
          // user.id
          userId
        );
      if (error) {
        throw new Error(error.message);
      }

      const marriedUsers = data.map(entry => entry.users);

      return res.status(200).json(marriedUsers);

    } catch (err) {
      console.error('Unexpected error:', err);

      if (err.message === "Failed to fetch") {
        return res.status(500).json({ error: 'Failed to fetch married users' });
      } else if (err.message === "No rows found") {
        return res.status(404).json({ error: 'No married users found' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}