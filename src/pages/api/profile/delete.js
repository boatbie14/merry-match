import { requireUser } from '@/middleware/requireUser';
import { createClient } from '@supabase/supabase-js'

//TODO 🔛 use service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {return res.status(405).json({ error: 'Method not allowed' });}
    try{
      const result = await requireUser(req, res);
      if (!result) return result;
      const {userId} = result

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteAuthError) {
      return res.status(500).json({ error: 'ลบผู้ใช้จาก Auth ไม่สำเร็จ' });
    }

    // 2. ลบไฟล์ใน Storage
    const bucketName = 'user-photos';
    const userFolder = `users/${userId}`;

    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(bucketName)
      .list(userFolder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (listError) {
      console.error('เกิดข้อผิดพลาดในการดึงไฟล์:', listError);
    } else {
      const pathsToDelete = files.map(file => `${userFolder}/${file.name}`);
      if (pathsToDelete.length > 0) {
        const { error: removeError } = await supabaseAdmin.storage
          .from(bucketName)
          .remove(pathsToDelete);
        if (removeError) {
          console.error('เกิดข้อผิดพลาดในการลบไฟล์:', removeError);
        }
      }
    }
    
    // 3. ลบจากตาราง users
    const { error: deleteUserError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteUserError) {
      return res.status(500).json({ error: 'ลบผู้ใช้จากตาราง users ไม่สำเร็จ' });
    }

    return res.status(204).json({});
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}