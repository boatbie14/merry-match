import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;

  const { data, error } = await supabase.from('packages').select('*').eq('id', id).single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
