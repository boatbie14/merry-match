import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);    
export default async function handler(req, res) {
  if (req.method === 'GET') {
     const userId = req.query.id;
    try {


      const { data, error } = await supabase
        .from('hobbies')
        .select('hobbie_name')
        .eq('user_id', 
          userId
        );
        console.log(data)
      if (error) {
        throw new Error(error.message);
      }

      const userHobbies = data
      console.log(userHobbies)
      return res.status(200).json(userHobbies);

    } catch (err) {
      console.error('Unexpected error:', err);

      if (err.message === "Failed to fetch") {
        return res.status(500).json({ error: 'Failed to fetch hobbies' });
      } else if (err.message === "No rows found") {
        return res.status(404).json({ error: 'No users found' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}