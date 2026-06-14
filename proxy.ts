import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const prodCookie = request.cookies.get("__Secure-better-auth.session_token");
    const devCookie = request.cookies.get("better-auth.session_token");

    console.log("=== Auth Cookie Debug ===");
    console.log("Current Pathname:", pathname);
    console.log("Production Cookie Object:", prodCookie); 
    console.log("Development Cookie Object:", devCookie);
    console.log("=========================");

    const sessionTokenValue = prodCookie?.value || devCookie?.value || "";

    if (pathname.startsWith("/company") && sessionTokenValue.trim() === "") {
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/company/:path*", "/insights"],
};