import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        setStatus('error');
        console.error('❌ Error:', error.message);
      } else {
        setUsers(data);
        setStatus('success');
        console.log('✅ Connected. Data:', data);
      }
    }

    fetchUsers();
  }, []);

  if (status === 'loading') return <p>กำลังโหลด...</p>;
  if (status === 'error') return <p style={{ color: 'red' }}>เชื่อมต่อ Supabase ไม่สำเร็จ</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Supabase Test</h1>
      {users.length === 0 ? (
        <p>✅ เชื่อมต่อสำเร็จ แต่ยังไม่มีข้อมูล</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
