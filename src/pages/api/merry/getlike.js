// ไม่ใช้ merry users เพราะมันหนักไป
import { requireUser } from "@/middleware/requireUser";
export default async function handler(req, res) {
  if (req.method !== 'GET')return res.status(405).json({ error: 'Method Not Allowed' });
    try {
      const result = await requireUser(req, res);
      if (!result) return result;
      const {supabase,userId} = result
      
      const { data, error } = await supabase
        .from('merry_list')
        .select('to_user_id')
        .eq('from_user_id',userId) 
      if (error) {throw new Error(error.message);}
      const formattedData = data?.map((item) => ({id: item.to_user_id,}));
      
      return res.status(200).json( formattedData );
  
    } catch (err) {
      console.error('Failed to fetch :', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
}