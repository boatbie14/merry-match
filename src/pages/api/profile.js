import { dummyUser, requireUser } from '@/middleware/requireUser';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      
      if (!result) return result;

    //   const { supabase, user } = result;
      const {supabase,userId} = result

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', 
          //user.id
          userId
        );
      if (userError) throw new Error(userError.message);

      const { data: hobbiesData, error: hobbiesError } = await supabase
        .from('hobbies')
        .select('hobbie_name')
        .eq('user_id', 
        // user.id
          userId
        );
      if (hobbiesError) throw new Error(hobbiesError.message);

      const hobbiesList = hobbiesData.map(hobby => hobby.hobbie_name);
      const data = [{...userData[0],hobbies: hobbiesList}];

      return res.status(200).json(data);

    } catch (err) {
      console.error('Unexpected error:', err);

      if (err.message === "Failed to fetch") {
        return res.status(500).json({ error: 'Failed to fetch user' });
      } else if (err.message === "No rows found") {
        return res.status(404).json({ error: 'No user found' });
      } else {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
}