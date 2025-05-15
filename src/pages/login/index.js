import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; 
import Link from 'next/link';
import Image from 'next/image';
import loginImage from '../../../public/assets/login-complaint.jpg';

// import NavbarNonUser from '../../components/NavbarNonUser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function logIn(e) {
    e.preventDefault();
    setError('');

    // 1. Login ด้วย email/password
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const userId = loginData.user.id;

    // 2. ดึง role จาก table `users` โดยใช้ user id
const { data: userRecord, error: userError } = await supabase
  .from('users')
  .select('user_role')
  .eq('id', userId)
  .single();

if (userError) {
  setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  return;
}

// 3. redirect ตาม user_role
if (userRecord.user_role === 'admin') {
  router.push('/admin');
} else {
  router.push('/homepage');
}

  }

  return (
    <>
      {/* <NavbarNonUser /> */}
      <main className="min-h-screen flex flex-col md:flex-row bg-[#fdfafd]">
        {/* Left image section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
          <div className="relative rounded-full overflow-hidden w-[380px] h-[500px] sm:w-[420px] sm:h-[540px] lg:w-[460px] lg:h-[580px] xl:w-[500px] xl:h-[620px] bg-white">
            <Image
              src={loginImage}
              alt="Login visual"
              fill
              className="object-cover object-right"
            />
          </div>
        </div>

        {/* Right form section */}
        <div className="w-full md:w-1/2 flex items-center justify-left px-6 sm:px-10 py-12">
          <div className="w-full max-w-md">
            <p className="text-sm text-[#a76300] uppercase font-medium mb-1">Login</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#941772] leading-snug">
              Welcome back to<br />Merry Match
            </h1>

            <form onSubmit={logIn} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">Username or Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded-md mt-1"
                  placeholder="Enter Username or Email"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded-md mt-1"
                  placeholder="Enter password"
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full py-3 bg-[#c4003b] text-white rounded-full shadow-md hover:bg-[#a90032] transition"
              >
                Log in
              </button>
            </form>

            <p className="text-sm mt-4 text-center">
              Don’t have an account?{' '}
              <Link href="/register" className="text-[#c4003b] font-medium">Register</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
