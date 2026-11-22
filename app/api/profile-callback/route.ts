import { NextResponse, NextRequest } from "next/server";
import { connection } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { userThemes, THEME_MAP } from "@/data/themes";

const VARIANT_COUNT = 5;

export async function GET(request: NextRequest) {
  await connection();

  try {
    const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

    if (!user || !user.userId || !user.email) {
      console.error("Profile callback failed: No active auth session or email found.");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { userId, email } = user;

    if (user.profile) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const themeCookie = request.cookies.get("taqtiq_theme_name");
    const cookieTheme = themeCookie?.value;

    const resolvedTheme =
      cookieTheme && THEME_MAP[cookieTheme]
        ? cookieTheme
        : userThemes[Math.floor(Math.random() * userThemes.length)].name;

    const avatarVariant = Math.floor(Math.random() * VARIANT_COUNT);
    const displayName = email.split("@")[0];

    await fetchAuthMutation(api.profiles.initialiseProfile, {
      userId,
      email,
      displayName,
      themeName: resolvedTheme,
      avatarVariant,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("CRITICAL: Onboarding checkpoint profile insertion error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}