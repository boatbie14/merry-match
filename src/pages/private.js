import { createClient } from '@/utils/supabase/server-props'

export default function PrivatePage({ user }) {
  return <h1>Hello, {user.email || 'user'}!</h1>
}

export async function getServerSideProps(context) {
  const supabase = createClient(context)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data || !data.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user: data.user,
    },
  }
}
