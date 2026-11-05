import { NextResponse, NextRequest } from "next/server";
import { connection } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { Id } from "@/convex/_generated/dataModel";
import { userThemes, THEME_MAP } from "@/data/themes";

function generateThemedGradientSVG(themeName?: string) {
  const theme = (themeName && THEME_MAP[themeName]) 
    ? THEME_MAP[themeName] 
    : userThemes[Math.floor(Math.random() * userThemes.length)];
    
  const angle = Math.floor(Math.random() * 360);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
        <stop offset="0%" style="stop-color:${theme.gradient[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${theme.gradient[1]};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grad)" />
  </svg>`;
}

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
    const themeName = themeCookie?.value;

    let profilePicField: Id<"_storage">;
    let publicProfilePicUrl = "";

    try {
      const svgString = generateThemedGradientSVG(themeName);

      const uploadUrl = await fetchAuthMutation(api.profiles.generateUploadUrl);
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/svg+xml" },
        body: svgString,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const { storageId } = await uploadResponse.json();
      profilePicField = storageId as Id<"_storage">;

      const urlResult = await fetchAuthQuery(api.profiles.getImageUrl, {
        storageId: profilePicField,
      });

      if (urlResult) {
        publicProfilePicUrl = urlResult;
      }
    } catch (uploadError) {
      console.error("Failed to upload default gradient to Convex storage:", uploadError);
      throw new Error("Onboarding failed: Could not generate required profile picture.");
    }

    const displayName = email.split("@")[0];

    await fetchAuthMutation(api.profiles.initialiseProfile, {
      userId: userId,
      email: email,
      displayName: displayName,
      defaultProfilePic: profilePicField,
    });

    return NextResponse.redirect(new URL("/", request.url));

  } catch (error) {
    console.error("CRITICAL: Onboarding checkpoint profile insertion error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}