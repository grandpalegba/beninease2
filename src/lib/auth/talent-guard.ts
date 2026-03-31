import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server-side talent authentication guard
 * Use in Server Components to verify talent authentication
 */
export async function verifyTalentAuth() {
  const supabase = await createSupabaseServerClient()
  
  // Step 1: Check Supabase session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    redirect('/talent/login')
  }

  // Step 2: Verify talent exists
  const { data: talent, error: talentError } = await supabase
    .from('talents')
    .select('id, prenom, nom, email')
    .eq('auth_user_id', session.user.id)
    .single()

  if (talentError || !talent) {
    // Sign out invalid user
    await supabase.auth.signOut()
    redirect('/talent/login')
  }

  return {
    talent,
    session,
    supabase
  }
}

/**
 * Get current talent data
 * Returns talent info if authenticated, null otherwise
 */
export async function getCurrentTalent() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const { data: talent } = await supabase
      .from('talents')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single()

    return talent
  } catch (error) {
    console.error('Error getting current talent:', error)
    return null
  }
}

/**
 * Check if user has talent role
 * Returns boolean for conditional rendering
 */
export async function isTalentUser() {
  const talent = await getCurrentTalent()
  return talent !== null
}
