// pages/api/delete-package.js
import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  const { error } = await supabase.from('packages').delete().eq('id', id);

  if (error) return res.status(500).json({ error });

  return res.status(200).json({ message: 'Package deleted successfully' });
}
