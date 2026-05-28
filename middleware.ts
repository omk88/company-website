import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    
    if (url.pathname.startsWith("/company")) {
        
        const sessionToken = request.cookies.get("better-auth.session_token");

        if (!sessionToken) {
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }

        try {
            const response = await fetch(`${url.origin}/api/auth/get-session`, {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            const session = await response.json();

            const userEmail = session?.user?.email || "";
            const companyDomain = "@taqtiq.tech";

            if (!userEmail.endsWith(companyDomain)) {
                url.pathname = "/"; 
                return NextResponse.redirect(url);
            }
        } catch (error) {
            url.pathname = "/sign-in";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/company/:path*"],
};