// lib/supabase-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          return undefined; // Next.js middleware doesn't return responses
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          return undefined;
        },
      },
    }
  );

  // Optional: Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

// Optional: Apply to protected routes
export const config = {
  matcher: ['/dashboard/:path*'], // Protect dashboard and subpaths
};