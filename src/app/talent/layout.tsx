import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TalentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/talent/login')
  }

  // Verify user is a talent
  const { data: talent } = await supabase
    .from('talents')
    .select('id')
    .eq('auth_user_id', session.user.id)
    .single()

  if (!talent) {
    redirect('/talent/login')
  }

  return <>{children}</>
}
