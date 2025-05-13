import { dummyUser, requireUser } from '@/middleware/requireUser';
// ## TODO 🗝️🕐 change meddleware
export default async function handler(req, res) {

  if(req.method === "GET"){
    try {
    // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      if (!result) return result;

    //   const { supabase, user } = result;
      const {supabase,userId} = result
      
   const { data, error } = await supabase
        .from('merry_list')
        .select('to_user_id')
        .eq('from_user_id',
          // user.id
          userId
        ) 
      if (error) {
         throw new Error(error.message);
      }
      const formattedData = data?.map((item) => ({id: item.to_user_id,}));
      return res.status(200).json( formattedData );
    } catch (err) {
      console.error('Failed to fetch :', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

    if (req.method === 'POST') {
        try {
    const{toUserId}=req.body

    // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      if (!result) return result;

    //   const { supabase, user } = result;
      const {supabase,userId} = result  

   const { data, error } = await supabase
        .from('merry_list')
        .insert([
          { from_user_id: userId, to_user_id: toUserId, created_at: new Date() },
        ]);

      if (error) {
        console.error('Error inserting like:', error);
        return res.status(500).json({ error: 'Failed to record the like' });
      }
      return res.status(200).json({ message: 'Like recorded successfully' });
    } catch (err) {
      console.error('Unexpected error during like:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }



  if (req.method === 'DELETE') {
    try {
    const{toUserId}=req.body
        console.log(req.body)
    // const result = await requireUser(req, res);
      const result = await dummyUser(req,res);
      if (!result) return result;

    //   const { supabase, user } = result;
      const {supabase,userId} = result

      const {data, error } = await supabase
        .from('merry_list')
        .delete()
        .match({ from_user_id: userId, to_user_id: toUserId });
      if (error) {
        console.error('Error unliking:', error);
        return res.status(500).json({ error: 'Failed to unlike' });
      }
        return res.status(200).json({ message: 'Like removed successfully' });
    } catch (err) {
      console.error('Unexpected error during unlike:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    }
  else {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST to record a like.' });
  }

}