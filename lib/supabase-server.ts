// lib/supabase-server.ts (Server-side client)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side Supabase client for Server Components and route handlers
export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const cookie = cookieStore.get(name);
        return cookie?.value ?? null;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // ignore errors when cookies are not mutable in this context
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch {
          // ignore errors when cookies are not mutable in this context
        }
      },
    },
  });
}
