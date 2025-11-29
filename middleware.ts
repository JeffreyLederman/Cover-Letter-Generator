// middleware.ts (root level)
// Simplified middleware: let Next.js handle routing; auth protection is done
// inside server components (e.g., dashboard layout) instead of here.
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
