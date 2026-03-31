import { createMiddlewareClient } from '@/lib/supabase/middleware-client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const res = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Protect /talent routes except login and forgot-password
  if (nextUrl.pathname.startsWith('/talent/') && 
      nextUrl.pathname !== '/talent/login' && 
      nextUrl.pathname !== '/talent/forgot-password') {
    
    const supabase = createMiddlewareClient(request, res)
    
    // Step 1: Check Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL('/talent/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Step 2: Verify talent exists
    const { data: talent } = await supabase
      .from('talents')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()

    // If not talent, sign out and redirect to login
    if (!talent) {
      await supabase.auth.signOut()
      const loginUrl = new URL('/talent/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/talent/:path*',
  ],
}
