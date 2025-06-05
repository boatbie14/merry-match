import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, package_name, merry_per_day, iconUrl, details } = req.body;

  const { error } = await supabase
    .from('packages')
    .update({
      package_name,
      merry_per_day,
      icon_url: iconUrl,
      description: details,
    })
    .eq('id', id);

  if (error) return res.status(500).json({ error });

  return res.status(200).json({ message: 'Package updated successfully' });
}
