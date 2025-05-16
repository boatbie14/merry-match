import { supabase } from '@/lib/supabaseClient';
export async function requireUser(req, res) {
  try {
    // ดึง token จาก header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
    // ตรวจสอบ token กับ Supabase และดึง user info
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = data.user.id;
    
    return {supabase, userId}
  } catch (err) {
    console.error('Error in requireUser:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



