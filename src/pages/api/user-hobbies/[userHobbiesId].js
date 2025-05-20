import { supabase } from "@/lib/supabaseClient";
export default async function handler(req, res) {
  if (req.method !== 'GET')return res.status(405).json({ error: 'Method Not Allowed' });
     const userHobbiesId = req.query.userHobbiesId;
    try {
      const { data, error } = await supabase
        .from('hobbies')
        .select('hobbie_name')
        .eq('user_id', 
          userHobbiesId
        );
      if (error) {
        throw new Error(error.message);
      }

      const userHobbies = data
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