import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const prodCookie = request.cookies.get("__Secure-better-auth.session_token");
    const devCookie = request.cookies.get("better-auth.session_token");
    const hasSession = Boolean(prodCookie?.value || devCookie?.value);

    const isAuthProtectedRoute = 
      pathname.startsWith("/company") || 
      pathname.startsWith("/create-blog") ||
      pathname.startsWith("/inbox");
      
    if (isAuthProtectedRoute && !hasSession) {
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      "/create-blog/:path*", 
      "/inbox/:path*"
    ],
};