// import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
export async function requireUser(req, res) {
  try {
    const supabase = createServerSupabaseClient({ req, res });
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized' });;
    }

    return { supabase, user };
  } catch (err) {
    console.error('Error in requireUser:', err);
    // res.status(500).json({ error: 'Internal Auth Error' });
    return null;
  }
}

export async function dummyUser(req, res) {
  const userId = "bfd42907-62fa-44c9-bf18-38ac7478ac35"
    
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

    console.log("middleeare",userId)
    // เราจะไม่เช็คการ login ของ user ในกรณีนี้
    return { supabase,userId };
  }