import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabase } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

/**
 * Server-side talent authentication guard
 * Use in Server Components to verify talent authentication
 */
export async function verifyAmbassadeurAuth() {
  const supabase = await createSupabaseServerClient()
  
  // Step 1: Check Supabase session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    redirect('/ambassadeur/login')
  }

  // Step 2: Verify talent exists
  const { data: ambassadeur, error: ambassadeurError } = await supabase
    .from('ambassadeurs')
    .select('id, prenom, nom, email')
    .eq('auth_user_id', session.user.id)
    .single()

  if (ambassadeurError || !ambassadeur) {
    // Sign out invalid user
    await supabase.auth.signOut()
    redirect('/ambassadeur/login')
  }

  return {
    ambassadeur,
    session,
    supabase
  }
}

/**
 * Get current talent data
 * Returns talent info if authenticated, null otherwise
 */
export async function getCurrentAmbassadeur() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    const { data: ambassadeur } = await supabase
      .from('ambassadeurs')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single()

    return ambassadeur
  } catch (error) {
    console.error('Error getting current ambassadeur:', error)
    return null
  }
}

/**
 * Check if user has talent role
 * Returns boolean for conditional rendering
 */
export async function isAmbassadeurUser() {
  const ambassadeur = await getCurrentAmbassadeur()
  return ambassadeur !== null
}
