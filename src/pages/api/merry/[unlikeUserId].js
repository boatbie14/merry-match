import { requireUser } from '@/middleware/requireUser';
import { deleteMerryLike,getMerryLike } from '@/utils/query/merryLike';
export default async function handler(req, res) {

  if (req.method !== 'DELETE')return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { unlikeUserId } = req.query;
    const toUserId = unlikeUserId
    
    const result = await requireUser(req, res);
    if (!result) return;
    const { userId } = result;

    const { data: existingLike} = await getMerryLike(userId, toUserId);
    if (!existingLike) {return res.status(200).json({ message: 'Already unliked' });}

    const {error} = await deleteMerryLike(userId, toUserId);
      if (error) {return res.status(500).json({ error: error.message });}

    return res.status(200).json({ message: 'User unliked successfully' });
    
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}