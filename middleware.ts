import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function middleware(req: NextRequest) {
  const { response: res, session } = await updateSession(req);

  // Ensure fresh session data by re-fetching if needed
  const supabase = createClient();
  const { data: { session: freshSession } } = await supabase.auth.getSession();

  // Protect all /admin routes except login
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!freshSession) {
      // Allow /admin/login for unauthenticated users
      if (req.nextUrl.pathname === '/admin/login') {
        return res;
      }
      // Redirect to login for other admin routes
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from login page
    if (req.nextUrl.pathname === '/admin/login' && freshSession) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle /auth/callback (e.g., after OAuth login)
  if (req.nextUrl.pathname === '/auth/callback') {
    if (freshSession) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback',
  ],
};