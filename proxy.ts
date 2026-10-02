import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server"; 

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const prodCookie = request.cookies.get("__Secure-better-auth.session_token");
    const devCookie = request.cookies.get("better-auth.session_token");
    const sessionTokenValue = prodCookie?.value || devCookie?.value || "";

    const userStatus = await fetchAuthQuery(api.manageUsers.getProxyUserStatus, {});

    const isAuthProtectedRoute = 
      pathname.startsWith("/company") || 
      pathname.startsWith("/create-blog") ||
      pathname.startsWith("/inbox");

    const isBanProtectedRoute = pathname.startsWith("/insights");

    if (isBanProtectedRoute && userStatus?.isBanned) {
        url.pathname = "/banned";
        return NextResponse.redirect(url);
    }

    if (isAuthProtectedRoute && sessionTokenValue.trim() === "") {
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      "/company/:path*", 
      "/insights", 
      "/create-blog/:path*", 
      "/inbox/:path*"
    ],
};