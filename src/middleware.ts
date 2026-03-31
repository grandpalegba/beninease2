import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize Supabase client
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Call supabase.auth.getSession()
  await supabase.auth.getSession()

  return res
}

export const config = {
  matcher: [
    '/talent/:path*',
  ],
}
